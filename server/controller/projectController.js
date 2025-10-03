import { connectDB } from "../config/db.js";
import { createProjectSchema, updateProjectSchema } from "../schemas/projectInputValidation.js";

export async function createProject(req, res) {
  const user = req.user;
  const user_id = user.id;
  const user_role = user.role;
  const { skill_id, title, description, media_url, price_range } = req.body;

  if (user_role !== 'freelancer') {
    return res.status(403).json({ message: "Only freelancers can create projects." });
  }

  if (!skill_id || !title || !description || !price_range) {
    return res.status(400).json({ message: "All required fields must be provided." });
  }

  try {
    await createProjectSchema.validate(req.body, { abortEarly: false });
    const db = await connectDB();

    // Check skill ownership
    const skill = await db.query(
      "SELECT * FROM skills WHERE id = $1 AND user_id = $2",
      [skill_id, user_id]
    );

    if (skill.rows.length === 0) {
      return res.status(403).json({ message: "Skill not found or you do not own it." });
    }

    // Insert project
    await db.query(
      `INSERT INTO projects (skill_id, title, description, media_url, price_range)
       VALUES ($1, $2, $3, $4, $5)`,
      [skill_id, title, description, media_url || '', price_range]
    );

    return res.status(201).json({ message: "Project created successfully." });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getProjectsBySkill(req, res) {
  const { skill_id } = req.params;
  if (!skill_id) return res.status(400).json({ message: "Skill ID is required." });

  try {
    const db = await connectDB();
    const result = await db.query(
      `SELECT p.*, s.skill_name
       FROM projects p
       JOIN skills s ON p.skill_id = s.id
       WHERE p.skill_id = $1
       ORDER BY p.id DESC`,
      [skill_id]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ message: "No projects found for this skill.", projects: [] });
    }

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getProjectById(req, res) {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Project ID is required." });

  try {
    const db = await connectDB();
    const result = await db.query(
      `SELECT p.*, s.skill_name
       FROM projects p
       JOIN skills s ON p.skill_id = s.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Project not found." });
    }

    return res.status(200).json(result.rows[0]);
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
  const { title, description, media_url, price_range } = req.body;

  if (!id) return res.status(400).json({ message: "Project ID is required." });
  if (user_role !== 'freelancer') {
    return res.status(403).json({ message: "Only freelancers can update projects." });
  }

  try {
    await updateProjectSchema.validate(req.body, { abortEarly: false });
    const db = await connectDB();

    // Get project and confirm ownership
    const project = await db.query(
      `SELECT p.*, s.user_id
       FROM projects p
       JOIN skills s ON p.skill_id = s.id
       WHERE p.id = $1`,
      [id]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({ message: "Project not found." });
    }

    if (project.rows[0].user_id !== user_id) {
      return res.status(403).json({ message: "You do not have permission to update this project." });
    }

    // Update project
    await db.query(
      `UPDATE projects
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           media_url = COALESCE($3, media_url),
           price_range = COALESCE($4, price_range)
       WHERE id = $5`,
      [title, description, media_url, price_range, id]
    );

    return res.status(200).json({ message: "Project updated successfully." });
  } catch (error) {
    console.error("Error updating project:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation failed", errors: error.errors });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteProject(req, res) {
  const { id } = req.params;
  const user = req.user;
  const user_id = user.id;
  const user_role = user.role;

  if (!id) return res.status(400).json({ message: "Project ID is required." });
  if (user_role !== 'freelancer') {
    return res.status(403).json({ message: "Only freelancers can delete projects." });
  }

  try {
    const db = await connectDB();

    // Verify ownership
    const project = await db.query(
      `SELECT p.*, s.user_id
       FROM projects p
       JOIN skills s ON p.skill_id = s.id
       WHERE p.id = $1`,
      [id]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({ message: "Project not found." });
    }

    if (project.rows[0].user_id !== user_id) {
      return res.status(403).json({ message: "You do not have permission to delete this project." });
    }

    await db.query("DELETE FROM projects WHERE id = $1", [id]);
    return res.status(200).json({ message: "Project deleted successfully." });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
