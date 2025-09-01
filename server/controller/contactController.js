import { connectDB } from "../config/db.js";
import { contactMethodSchema } from "../schemas/contactInputValidation.js";

// Create or update WhatsApp
export async function setContactMethod(req, res) {
  const user = req.user;
  const user_id = user.id;
  const { whatsapp, email, linkedin } = req.body;

  const updateFields = {};
  if (whatsapp !== undefined) updateFields.whatsapp = whatsapp;
  if (email !== undefined) updateFields.email = email;
  if (linkedin !== undefined) updateFields.linkedin = linkedin;

  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ message: "No contact data provided" });
  }

  try {
    // Validate each field using the schema
    await contactMethodSchema.validate(updateFields);

    const db = await connectDB();

    // Dynamically build column names and values
    const columns = Object.keys(updateFields).join(', ');
    const placeholders = Object.keys(updateFields).map(() => '?').join(', ');
    const values = Object.values(updateFields);

    // Build ON CONFLICT SET part
    const updateClause = Object.keys(updateFields)
      .map((key) => `${key} = excluded.${key}`)
      .join(', ');

    const query = `
      INSERT INTO contact_methods (user_id, ${columns})
      VALUES (?, ${placeholders})
      ON CONFLICT(user_id) DO UPDATE SET ${updateClause};
    `;

    await new Promise((resolve, reject) => {
      db.run(query, [user_id, ...values], function (err) {
        if (err) reject(err);
        else resolve(this);
      });
    });

    await new Promise((resolve, reject) => {
      db.close((err) => (err ? reject(err) : resolve()));
    });

    res.json({ message: "Contact methods updated successfully" });
  } catch (err) {
    console.error("Error updating contact methods:", err);
    res.status(400).json({ message: err.message });
  }
}



export async function getContactMethods(req, res) {
  const { id } = req.params;
  try {
    const db = await connectDB();

    const contactRow = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM contact_methods WHERE user_id = ?", [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    await new Promise((resolve, reject) => {
      db.close((err) => (err ? reject(err) : resolve()));
    });

    if (!contactRow) {
      return res.json([]);
    }

    // 🔹 Convert row into array of {type, value}
    const contacts = Object.entries(contactRow)
      .filter(([key, value]) => ["whatsapp", "email", "linkedin"].includes(key) && value)
      .map(([key, value]) => ({ type: key, value }));

    res.json(contacts);

  } catch (err) {
    console.error("Error in getContactMethods:", err);
    res.status(500).json({
      message: "Error fetching contact methods",
      error: err.message,
    });
  }
}

export async function getUserContactMethods(req, res) {
    const user = req.user
    const user_id = user.id
  try {    
    const db = await connectDB();

    // Wrap sqlite3's callback-based db.all in a Promise
    const contact = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM contact_methods where user_id = ?", [user_id], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    await new Promise((resolve, reject) => {
      db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json(contact);

  } catch (err) {
    console.error("Error in getContactMethods:", err);
    res.status(500).json({
      message: "Error fetching contact methods",
      error: err.message,
    });
  }
}