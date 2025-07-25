import { connectDB } from "../config/db.js";
import { createJobSchema } from "../schemas/createJobInputValidation.js";

  export async function createJob(req, res) {
    const user = req.user; // From JWT middleware
    const user_id = user.id
    const user_role = user.role
    const { title, description, budget, category, deadline } = req.body;

    // Only clients can create jobs
    if (user_role !== 'client') {
      return res.status(403).json({ message: "Only clients can create jobs." });
    }

    // Basic validation
    if (!title || !description || !budget || !category || !deadline) {
      return res.status(400).json({ message: "All fields are required." });
    }

    try {

      //  Validate input
      await createJobSchema.validate(req.body, { abortEarly: false })

      const db = await connectDB();

      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO jobs (client_id, title, description, budget, category, deadline)
          VALUES (?, ?, ?, ?, ?, ?)`,
          [user_id, title, description, budget, category, deadline],
          function (err) {
            if (err) reject(err);
            else resolve();
          }
        );
      });

      db.close();

      return res.status(201).json({ message: "Job created successfully." });
    } catch (error) {
      console.error("Error creating job:", error);

      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors
        })
      }
      
      return res.status(500).json({ message: "Internal server error" });
    }
  }

export async function getAllJobs(req, res) {
  try {
    const db = await connectDB();

    const jobs = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM jobs ORDER BY created_at DESC", [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    db.close();

    return res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMyPostedJobs(req, res) {
  const user = req.user;
  const user_id = user.id;       // From JWT middleware
  const user_role = user.role;   // From JWT middleware

  if (user_role !== 'client') {
    return res.status(403).json({ message: "Only clients can view their posted jobs." });
  }

  try {
    const db = await connectDB();

    const jobs = await new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM jobs WHERE client_id = ? ORDER BY created_at DESC",
        [user_id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    db.close();

    if (!jobs || jobs.length === 0) {
      return res.status(200).json({ message: "You have not posted any jobs yet.", jobs: [] });
    }

    return res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching client jobs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


export async function deleteJob(req, res) {
  const { id } = req.params;
  const user_id = req.user.id; // from JWT middleware
  const user_role = req.user.role; // from JWT middleware

  // Ensure only clients can delete jobs
  if (user_role !== 'client') {
    return res.status(403).json({ message: "Only clients can delete jobs." });
  }

  try {
    const db = await connectDB();

    // Step 1: Fetch job to verify ownership
    const job = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM jobs WHERE id = ?", [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!job) {
      db.close();
      return res.status(404).json({ message: "Job not found." });
    }

    if (job.client_id !== user_id) {
      db.close();
      return res.status(403).json({ message: "You do not have permission to delete this job." });
    }

    // Step 2: Delete the job
    await new Promise((resolve, reject) => {
      db.run("DELETE FROM jobs WHERE id = ?", [id], function (err) {
        if (err) reject(err);
        else resolve();
      });
    });

    db.close();

    return res.status(200).json({ message: "Job deleted successfully." });
  } catch (error) {
    console.error("Error deleting job:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}