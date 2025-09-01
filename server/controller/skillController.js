import { connectDB } from "../config/db.js"
import { createSkillSchema } from "../schemas/skillInputValidation.js";

export async function createSkill(req, res) {
  try {
    const { skill_name, description } = req.body;
    const user_id = req.user.id;

    await createSkillSchema.validate(req.body, { abortEarly: false });

    if (!skill_name) {
      return res.status(400).json({ message: "Skill name is required" });
    }

    const db = await connectDB();

    const result = await new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO skills (user_id, skill_name, description) VALUES (?, ?, ?)",
        [user_id, skill_name, description],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID });
        }
      );
    });

    db.close();

    res.status(201).json({
      message: "Skill created successfully",
      skill: {
        id: result.id,
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

export async function getAllSkills(req, res) {
  try {
    const db = await connectDB();

    const skills = await new Promise((resolve, reject) => {
      db.all(
        "SELECT skill_name, description FROM skills",
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    db.close();

    res.status(200).json({
      message: "All skills retrieved successfully",
      skills: skills
    });

  } catch (error) {
    console.error("Error in getAllSkills controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUserSkills(req, res) {
  const user_id = req.user.id;

  try {
    const db = await connectDB();

    // Get all skills for this user
    const skills = await new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM skills WHERE user_id = ?`,
        [user_id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    // For each skill, get projects
    for (const skill of skills) {
      const projects = await new Promise((resolve, reject) => {
        db.all(
          `SELECT * FROM projects WHERE skill_id = ?`,
          [skill.id],
          (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          }
        );
      });

      skill.projects = projects;
    }

    db.close();
    console.log("Fetched skills:", skills);
    return res.status(200).json(skills);
  } catch (error) {
    console.error("Error fetching user skills:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUserSkillsById(req, res) {
  const user_id = req.params.id;

  try {
    const db = await connectDB();

    // Get all skills for this user
    const skills = await new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM skills WHERE user_id = ?`,
        [user_id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    // For each skill, get projects
    for (const skill of skills) {
      const projects = await new Promise((resolve, reject) => {
        db.all(
          `SELECT * FROM projects WHERE skill_id = ?`,
          [skill.id],
          (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          }
        );
      });

      skill.projects = projects;
    }

    db.close();
    console.log("Fetched skills:", skills);
    return res.status(200).json(skills);
  } catch (error) {
    console.error("Error fetching user skills:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


export async function updateSkill(req, res) {
  const { id } = req.params;
  const user_id = req.user.id;
  const { skill_name, description } = req.body;

  try {
    const db = await connectDB();

    // Step 1: Fetch the existing skill
    const skill = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM skills WHERE id = ?", [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!skill) {
      db.close();
      return res.status(404).json({ message: "Skill not found" });
    }

    if (skill.user_id !== user_id) {
      db.close();
      return res.status(403).json({ message: "You do not have permission to update this skill" });
    }

    // Step 2: Use existing values if updates are not provided
    const updatedSkillName = skill_name || skill.skill_name;
    const updatedDescription = description || skill.description;

    // Step 3: Perform the update
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE skills SET skill_name = ?, description = ? WHERE id = ?`,
        [updatedSkillName, updatedDescription, id],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    db.close();

    return res.status(200).json({ message: "Skill updated successfully" });
  } catch (error) {
    console.error("Error updating skill:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


export async function deleteSkill(req, res) {
  const { id } = req.params;
  const user_id = req.user.id; // From JWT middleware

  try {
    const db = await connectDB();

    // Step 1: Fetch the skill
    const skill = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM skills WHERE id = ?", [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!skill) {
      db.close();
      return res.status(404).json({ message: "Skill not found" });
    }

    // Step 2: Check if user owns the skill
    if (skill.user_id !== user_id) {
      db.close();
      return res.status(403).json({ message: "You do not have permission to delete this skill" });
    }

    // Step 3: Delete the skill
    const result = await new Promise((resolve, reject) => {
      db.run("DELETE FROM skills WHERE id = ?", [id], function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
    console.log(`Deleted skill with id ${id}, affected rows: ${result}`);
    db.close();

    return res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Error deleting skill:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}



