import { connectDB } from "../config/db.js";
import { updateUserSchema } from "../schemas/userInputValidation.js";

// ✅ Get all freelancers
export async function getAllUsers(req, res) {
  try {
    const pool = await connectDB();

    const result = await pool.query(
      `
      SELECT 
        u.id, u.first_name, u.last_name, u.email,
        STRING_AGG(ur.role, ',') AS roles,
        u.bio, u.profile_picture, u.created_at
      FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      WHERE ur.role = 'freelancer'
      GROUP BY u.id
      `
    );

    const users = result.rows.map((user) => ({
      ...user,
      roles: user.roles ? user.roles.split(",") : [],
    }));

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// ✅ Get single user by ID
export async function getUserById(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const pool = await connectDB();

    const result = await pool.query(
      `
      SELECT 
        u.id, u.first_name, u.last_name, u.email,
        STRING_AGG(ur.role, ',') AS roles,
        u.bio, u.profile_picture
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      WHERE u.id = $1
      GROUP BY u.id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = result.rows[0];
    user.roles = user.roles ? user.roles.split(",") : [];

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// ✅ Update user
export async function updateUser(req, res) {
  const { id } = req.params;
  const authUser = req.user;
  const user_id = authUser.id;

  const {
    first_name,
    last_name,
    email,
    bio,
    profile_picture,
    whatsapp,
    linkedin
  } = req.body;

  if (parseInt(id) !== user_id) {
    return res
      .status(403)
      .json({ message: "You do not have permission to update this user." });
  }

  try {
    await updateUserSchema.validate(req.body, { abortEarly: false });

    const pool = await connectDB();
    const client = await pool.connect(); // ✅ for transaction

    try {
      await client.query("BEGIN");

      // Step 1: Fetch existing user
      const userResult = await client.query("SELECT * FROM users WHERE id = $1", [id]);

      if (userResult.rows.length === 0) {
        await client.query("ROLLBACK");
        client.release();
        return res.status(404).json({ message: "User not found" });
      }

      const existingUser = userResult.rows[0];

      // Step 2: Fetch existing contact methods
      const contactResult = await client.query(
        "SELECT * FROM contact_methods WHERE user_id = $1",
        [id]
      );
      const existingContacts = contactResult.rows[0] || {};

      // Step 3: Merge updates
      const updatedFirstName = first_name || existingUser.first_name;
      const updatedLastName = last_name || existingUser.last_name;
      const updatedEmail = email || existingUser.email;
      const updatedBio = bio || existingUser.bio;
      const updatedProfilePic = profile_picture || existingUser.profile_picture;

      const updatedWhatsapp = whatsapp || existingContacts.whatsapp || null;
      const updatedLinkedin = linkedin || existingContacts.linkedin || null;
      const updatedContactEmail = email || existingContacts.email || existingUser.email;

      // Step 4: Update users table
      await client.query(
        `UPDATE users 
         SET first_name = $1, last_name = $2, email = $3, bio = $4, profile_picture = $5
         WHERE id = $6`,
        [
          updatedFirstName,
          updatedLastName,
          updatedEmail,
          updatedBio,
          updatedProfilePic,
          id
        ]
      );

      // Step 5: Upsert into contact_methods
      await client.query(
        `INSERT INTO contact_methods (user_id, whatsapp, email, linkedin)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id) DO UPDATE SET
           whatsapp = EXCLUDED.whatsapp,
           email = EXCLUDED.email,
           linkedin = EXCLUDED.linkedin`,
        [id, updatedWhatsapp, updatedContactEmail, updatedLinkedin]
      );

      await client.query("COMMIT");
      client.release();

      return res.status(200).json({ message: "User profile updated successfully" });
    } catch (err) {
      await client.query("ROLLBACK");
      client.release();
      throw err;
    }
  } catch (error) {
    console.error("Error updating user:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors
      });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
}
