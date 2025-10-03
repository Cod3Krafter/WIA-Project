import { connectDB } from "../config/db.js";
import { contactMethodSchema } from "../schemas/contactInputValidation.js";

// Create or update WhatsApp/Email/LinkedIn
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
    // ✅ Validate each field using the schema
    await contactMethodSchema.validate(updateFields);

    const db = await connectDB();

    // Build column names and placeholders dynamically
    const columns = Object.keys(updateFields).join(", ");
    const placeholders = Object.keys(updateFields)
      .map((_, idx) => `$${idx + 2}`)
      .join(", ");
    const values = Object.values(updateFields);

    // Build ON CONFLICT SET clause
    const updateClause = Object.keys(updateFields)
      .map((key) => `${key} = EXCLUDED.${key}`)
      .join(", ");

    const query = `
      INSERT INTO contact_methods (user_id, ${columns})
      VALUES ($1, ${placeholders})
      ON CONFLICT (user_id) DO UPDATE SET ${updateClause};
    `;

    await db.query(query, [user_id, ...values]);

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

    const { rows } = await db.query(
      "SELECT * FROM contact_methods WHERE user_id = $1",
      [id]
    );
    const contactRow = rows[0];

    if (!contactRow) {
      return res.json([]);
    }

    // 🔹 Convert row into array of { type, value }
    const contacts = Object.entries(contactRow)
      .filter(
        ([key, value]) =>
          ["whatsapp", "email", "linkedin"].includes(key) && value
      )
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
  const user = req.user;
  const user_id = user.id;

  try {
    const db = await connectDB();

    const { rows } = await db.query(
      "SELECT * FROM contact_methods WHERE user_id = $1",
      [user_id]
    );
    const contact = rows[0] || null;

    res.json(contact);
  } catch (err) {
    console.error("Error in getUserContactMethods:", err);
    res.status(500).json({
      message: "Error fetching contact methods",
      error: err.message,
    });
  }
}
