import { connectDB } from "../config/db.js";
import { createProjectSchema, updateProjectSchema } from "../schemas/projectInputValidation.js";

export async function createProject(req, res) {
  const user = req.user;
  const user_id = user.id;
  const user_role = user.role;
  const { skill_id, title, description, media_url, price_range, contact_method_id } = req.body;

  // Only freelancers can create projects
  if (user_role !== 'freelancer') {
    return res.status(403).json({ message: "Only freelancers can create projects." });
  }

  // Validate input
  if (!skill_id || !title || !description || !price_range || !contact_method_id) {
    return res.status(400).json({ message: "All required fields must be provided." });
  }

  try {
    // Validate input
    await createProjectSchema.validate(req.body, { abortEarly: false });
    
    const db = await connectDB();

    // Check if the skill exists and belongs to this freelancer
    const skill = await new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM skills WHERE id = ? AND user_id = ?",
        [skill_id, user_id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!skill) {
      db.close();
      return res.status(403).json({ message: "Skill not found or you do not own it." });
    }

    // Insert the project
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO projects (skill_id, title, description, media_url, price_range, contact_method_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [skill_id, title, description, media_url || '', price_range, contact_method_id],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    db.close();
    return res.status(201).json({ message: "Project created successfully." });

  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getProjectsBySkill(req, res) {
  const { skill_id } = req.params;

  if (!skill_id) {
    return res.status(400).json({ message: "Skill ID is required." });
  }

  try {
    const db = await connectDB();

    const projects = await new Promise((resolve, reject) => {
      db.all(
        `
        SELECT 
          projects.*,
          skills.skill_name
        FROM projects
        JOIN skills ON projects.skill_id = skills.id
        WHERE projects.skill_id = ?
        ORDER BY projects.id DESC
        `,
        [skill_id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    db.close();

    if (!projects || projects.length === 0) {
      return res.status(200).json({ message: "No projects found for this skill.", projects: [] });
    }

    return res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getProjectById(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Project ID is required." });
  }

  try {
    const db = await connectDB();

    const project = await new Promise((resolve, reject) => {
      db.get(
        `
        SELECT 
          projects.*,
          skills.skill_name
        FROM projects
        JOIN skills ON projects.skill_id = skills.id
        WHERE projects.id = ?
        `,
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    db.close();

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    return res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


export async function updateProject(req, res) {
  const { id } = req.params;
  const user = req.user;
  const user_id = user.id;
  const user_role = user.role;

  const { title, description, media_url, price_range, contact_method_id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Project ID is required." });
  }

  if (user_role !== 'freelancer') {
    return res.status(403).json({ message: "Only freelancers can update projects." });
  }

  try {
    //  Validate input / Request body
    await updateProjectSchema.validate(req.body, { abortEarly: false })
    const db = await connectDB();

    // Step 1: Get the project and confirm ownership via skills table
    const project = await new Promise((resolve, reject) => {
      db.get(
        `SELECT p.*, s.user_id
         FROM projects p
         JOIN skills s ON p.skill_id = s.id
         WHERE p.id = ?`,
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!project) {
      db.close();
      return res.status(404).json({ message: "Project not found." });
    }

    if (project.user_id !== user_id) {
      db.close();
      return res.status(403).json({ message: "You do not have permission to update this project." });
    }

    // Step 2: Perform the update using fallback to existing values
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE projects
         SET title = ?, description = ?, media_url = ?, price_range = ?, contact_method_id = ?
         WHERE id = ?`,
        [
          title || project.title,
          description || project.description,
          media_url || project.media_url,
          price_range || project.price_range,
          contact_method_id || project.contact_method_id,
          id
        ],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    db.close();
    return res.status(200).json({ message: "Project updated successfully." });

  } catch (error) {
    console.error("Error updating project:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors
      })
    }

    return res.status(500).json({ message: "Internal server error" });
  }
}


export async function deleteProject(req, res) {
  const { id } = req.params;
  const user = req.user;
  const user_id = user.id;
  const user_role = user.role;

  if (!id) {
    return res.status(400).json({ message: "Project ID is required." });
  }

  if (user_role !== 'freelancer') {
    return res.status(403).json({ message: "Only freelancers can delete projects." });
  }

  try {
    const db = await connectDB();

    // Step 1: Verify project ownership via skills.user_id
    const project = await new Promise((resolve, reject) => {
      db.get(
        `SELECT p.*, s.user_id
         FROM projects p
         JOIN skills s ON p.skill_id = s.id
         WHERE p.id = ?`,
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!project) {
      db.close();
      return res.status(404).json({ message: "Project not found." });
    }

    if (project.user_id !== user_id) {
      db.close();
      return res.status(403).json({ message: "You do not have permission to delete this project." });
    }

    // Step 2: Delete the project
    await new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM projects WHERE id = ?`,
        [id],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    db.close();
    return res.status(200).json({ message: "Project deleted successfully." });

  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}



