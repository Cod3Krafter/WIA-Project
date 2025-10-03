import { connectDB } from "../config/db.js";
import { createJobSchema } from "../schemas/createJobInputValidation.js";

// Create a new job
export async function createJob(req, res) {
  const user = req.user;
  const user_id = user.id;
  const selectedRole = req.headers["x-active-role"];
  const { title, description, budget, category, deadline } = req.body;

  if (selectedRole !== "client") {
    return res.status(403).json({ message: "Only clients can create jobs." });
  }

  if (!title || !description || !budget || !category || !deadline) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    await createJobSchema.validate(req.body, { abortEarly: false });

    const db = await connectDB();

    await db.query(
      `INSERT INTO jobs (client_id, title, description, budget, category, deadline)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [user_id, title, description, budget, category, deadline]
    );

    return res.status(201).json({ message: "Job created successfully." });
  } catch (error) {
    console.error("Error creating job:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation failed", errors: error.errors });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
}

// Get all jobs
export async function getAllJobs(req, res) {
  try {
    const db = await connectDB();

    const jobsResult = await db.query("SELECT * FROM jobs ORDER BY created_at DESC");

    return res.status(200).json(jobsResult.rows);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Get jobs posted by the logged-in client
export async function getMyPostedJobs(req, res) {
  const user = req.user;
  const user_id = user.id;
  const selectedRole = req.headers["x-active-role"];

  if (selectedRole !== "client") {
    return res.status(403).json({ message: "Only clients can view their posted jobs." });
  }

  try {
    const db = await connectDB();

    const jobsResult = await db.query(
      "SELECT * FROM jobs WHERE client_id = $1 ORDER BY created_at DESC",
      [user_id]
    );

    if (jobsResult.rowCount === 0) {
      return res
        .status(200)
        .json({ message: "You have not posted any jobs yet.", jobs: [] });
    }

    return res.status(200).json(jobsResult.rows);
  } catch (error) {
    console.error("Error fetching client jobs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Update a job post
export async function updateJobPost(req, res) {
  const { id } = req.params;
  const { title, description, budget } = req.body;
  const user_id = req.user.id;
  const selectedRole = req.headers["x-active-role"];

  if (selectedRole !== "client") {
    return res.status(403).json({ message: "Only clients can update jobs." });
  }

  try {
    const db = await connectDB();

    const jobResult = await db.query("SELECT * FROM jobs WHERE id = $1", [id]);

    if (jobResult.rowCount === 0) {
      return res.status(404).json({ message: "Job not found." });
    }

    const job = jobResult.rows[0];
    if (job.client_id !== user_id) {
      return res
        .status(403)
        .json({ message: "You do not have permission to update this job." });
    }

    await db.query(
      "UPDATE jobs SET title = $1, description = $2, budget = $3 WHERE id = $4",
      [title, description, budget, id]
    );

    return res.status(200).json({ message: "Job updated successfully." });
  } catch (error) {
    console.error("Error updating job:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

// Delete a job
export async function deleteJob(req, res) {
  const { id } = req.params;
  const user_id = req.user.id;
  const selectedRole = req.headers["x-active-role"];

  if (selectedRole !== "client") {
    return res.status(403).json({ message: "Only clients can delete jobs." });
  }

  try {
    const db = await connectDB();

    const jobResult = await db.query("SELECT * FROM jobs WHERE id = $1", [id]);

    if (jobResult.rowCount === 0) {
      return res.status(404).json({ message: "Job not found." });
    }

    const job = jobResult.rows[0];
    if (job.client_id !== user_id) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this job." });
    }

    await db.query("DELETE FROM jobs WHERE id = $1", [id]);

    return res.status(200).json({ message: "Job deleted successfully." });
  } catch (error) {
    console.error("Error deleting job:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
