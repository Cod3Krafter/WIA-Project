import { connectDB } from "../config/db.js"
import { createSkillSchema } from "../schemas/skillInputValidation.js";

// ✅ Create Skill
export async function createSkill(req, res) {
  try {
    const { skill_name, description } = req.body;
    const user_id = req.user.id;

    await createSkillSchema.validate(req.body, { abortEarly: false });

    if (!skill_name) {
      return res.status(400).json({ message: "Skill name is required" });
    }

    const pool = await connectDB();

    const result = await pool.query(
      "INSERT INTO skills (user_id, skill_name, description) VALUES ($1, $2, $3) RETURNING id",
      [user_id, skill_name, description]
    );

    res.status(201).json({
      message: "Skill created successfully",
      skill: {
        id: result.rows[0].id,
        user_id,
        skill_name,
        description
      }
    });

  } catch (error) {
    console.error("Error in createSkill controller:", error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors
      });
    }

    res.status(500).json({ message: "Internal server error" });
  }
}

// ✅ Get All Skills
export async function getAllSkills(req, res) {
  try {
    const pool = await connectDB();
    const result = await pool.query("SELECT skill_name, description FROM skills");

    res.status(200).json({
      message: "All skills retrieved successfully",
      skills: result.rows
    });

  } catch (error) {
    console.error("Error in getAllSkills controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ✅ Get Skills for Logged-In User
export async function getUserSkills(req, res) {
  const user_id = req.user.id;

  try {
    const pool = await connectDB();

    const skillsResult = await pool.query(
      "SELECT * FROM skills WHERE user_id = $1",
      [user_id]
    );

    const skills = [];
    for (const skill of skillsResult.rows) {
      const projectsResult = await pool.query(
        "SELECT * FROM projects WHERE skill_id = $1",
        [skill.id]
      );
      skills.push({ ...skill, projects: projectsResult.rows });
    }

    return res.status(200).json(skills);
  } catch (error) {
    console.error("Error fetching user skills:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// ✅ Get Skills by User ID
export async function getUserSkillsById(req, res) {
  const user_id = req.params.id;

  try {
    const pool = await connectDB();

    const skillsResult = await pool.query(
      "SELECT * FROM skills WHERE user_id = $1",
      [user_id]
    );

    const skills = [];
    for (const skill of skillsResult.rows) {
      const projectsResult = await pool.query(
        "SELECT * FROM projects WHERE skill_id = $1",
        [skill.id]
      );
      skills.push({ ...skill, projects: projectsResult.rows });
    }

    return res.status(200).json(skills);
  } catch (error) {
    console.error("Error fetching user skills:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// ✅ Update Skill
export async function updateSkill(req, res) {
  const { id } = req.params;
  const user_id = req.user.id;
  const { skill_name, description } = req.body;

  try {
    const pool = await connectDB();

    const skillResult = await pool.query(
      "SELECT * FROM skills WHERE id = $1",
      [id]
    );

    if (skillResult.rows.length === 0) {
      return res.status(404).json({ message: "Skill not found" });
    }

    const skill = skillResult.rows[0];

    if (skill.user_id !== user_id) {
      return res.status(403).json({ message: "You do not have permission to update this skill" });
    }

    const updatedSkillName = skill_name || skill.skill_name;
    const updatedDescription = description || skill.description;

    await pool.query(
      "UPDATE skills SET skill_name = $1, description = $2 WHERE id = $3",
      [updatedSkillName, updatedDescription, id]
    );

    return res.status(200).json({ message: "Skill updated successfully" });
  } catch (error) {
    console.error("Error updating skill:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// ✅ Delete Skill
export async function deleteSkill(req, res) {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const pool = await connectDB();

    const skillResult = await pool.query(
      "SELECT * FROM skills WHERE id = $1",
      [id]
    );

    if (skillResult.rows.length === 0) {
      return res.status(404).json({ message: "Skill not found" });
    }

    const skill = skillResult.rows[0];

    if (skill.user_id !== user_id) {
      return res.status(403).json({ message: "You do not have permission to delete this skill" });
    }

    await pool.query("DELETE FROM skills WHERE id = $1", [id]);

    return res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Error deleting skill:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
