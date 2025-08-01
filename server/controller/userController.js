import { connectDB } from "../config/db.js"
import { updateUserSchema } from "../schemas/userInputValidation.js";



export async function getAllUsers(req, res) {
  try {
    const db = await connectDB();

    const users = await new Promise((resolve, reject) => {
      db.all(
        `
        SELECT 
          u.id, u.first_name, u.last_name, u.email,
          GROUP_CONCAT(ur.role) AS roles,
          u.bio, u.profile_picture, u.created_at
        FROM users u
        JOIN user_roles ur ON u.id = ur.user_id
        WHERE ur.role = 'freelancer'
        GROUP BY u.id
        `,
        [],
        (err, rows) => {
          if (err) reject(err);
          else {
            const formatted = rows.map((user) => ({
              ...user,
              roles: user.roles.split(","),
            }));
            resolve(formatted);
          }
        }
      );
    });

    db.close();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUserById(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const db = await connectDB();

    const user = await new Promise((resolve, reject) => {
      db.get(
        `
        SELECT 
          u.id, u.first_name, u.last_name, u.email,
          GROUP_CONCAT(ur.role) AS roles,
          u.bio, u.profile_picture
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        WHERE u.id = ?
        GROUP BY u.id
        `,
        [id],
        (err, row) => {
          if (err) reject(err);
          else {
            if (row) {
              row.roles = row.roles ? row.roles.split(",") : [];
            }
            resolve(row);
          }
        }
      );
    });

    db.close();

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateUser(req, res) {
  const { id } = req.params;
  const user = req.user
  const user_id = user.id;
  const { first_name, last_name, email, bio, profile_picture } = req.body;

  if (parseInt(id) !== user_id) {
    return res.status(403).json({ message: "You do not have permission to update this user." });
  }

  try {

    await updateUserSchema.validate(req.body, { abortEarly: false });

    const db = await connectDB();

    // Step 1: Fetch the existing user
    const user = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      db.close();
      return res.status(404).json({ message: "User not found" });
    }

    // Step 2: Use existing values if fields not provided
    const updatedFirstName = first_name || user.first_name;
    const updatedLastName = last_name || user.last_name;
    const updatedEmail = email || user.email;
    const updatedBio = bio || user.bio;
    const updatedProfilePic = profile_picture || user.profile_picture;

    // Step 3: Perform the update
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE users 
         SET first_name = ?, last_name = ?, email = ?, bio = ?, profile_picture = ?
         WHERE id = ?`,
        [
          updatedFirstName,
          updatedLastName,
          updatedEmail,
          updatedBio,
          updatedProfilePic,
          id
        ],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    db.close();
    return res.status(200).json({ message: "User profile updated successfully" });

  } catch (error) {
    console.error("Error updating user:", error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors
      });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
}
