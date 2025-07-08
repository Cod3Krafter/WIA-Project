import { connectDB } from "../config/db.js"
import { updateUserSchema } from "../schemas/userInputValidation.js";

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
          id, first_name, last_name, email, role, bio, profile_picture
        FROM users
        WHERE id = ?
        `,
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
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

    // ✅ Validate input
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
