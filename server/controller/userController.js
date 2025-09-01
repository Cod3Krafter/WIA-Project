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

    const db = await connectDB();

    // Step 1: Fetch the existing user
    const existingUser = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!existingUser) {
      db.close();
      return res.status(404).json({ message: "User not found" });
    }

    // Step 2: Fetch contact methods
    const existingContacts = await new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM contact_methods WHERE user_id = ?",
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    // Step 3: Use existing values if not provided
    const updatedFirstName = first_name || existingUser.first_name;
    const updatedLastName = last_name || existingUser.last_name;
    const updatedEmail = email || existingUser.email;
    const updatedBio = bio || existingUser.bio;
    const updatedProfilePic =
      profile_picture || existingUser.profile_picture;

    const updatedWhatsapp =
      whatsapp || (existingContacts ? existingContacts.whatsapp : null);
    const updatedLinkedin =
      linkedin || (existingContacts ? existingContacts.linkedin : null);
    const updatedContactEmail =
      email || (existingContacts ? existingContacts.email : existingUser.email);

    // Step 4: Run updates inside a transaction
    await new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        // update users table
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
            if (err) {
              db.run("ROLLBACK");
              reject(err);
              return;
            }
          }
        );

        // upsert contact_methods (since user_id is unique)
        db.run(
          `INSERT INTO contact_methods (user_id, whatsapp, email, linkedin)
           VALUES (?, ?, ?, ?)
           ON CONFLICT(user_id) DO UPDATE SET
             whatsapp = excluded.whatsapp,
             email = excluded.email,
             linkedin = excluded.linkedin`,
          [id, updatedWhatsapp, updatedContactEmail, updatedLinkedin],
          function (err) {
            if (err) {
              db.run("ROLLBACK");
              reject(err);
              return;
            }
          }
        );

        db.run("COMMIT", (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });

    db.close();
    return res.status(200).json({ message: "User profile updated successfully" });
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

