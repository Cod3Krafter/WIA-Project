import { connectDB } from "../config/db.js";

// Toggle save/unsave job
export async function toggleSaveJob(req, res) {
  const user = req.user;
  const user_id = user.id;
  const user_role = user.role;
  const { job_id } = req.body;

  if (user_role !== 'freelancer') {
    return res.status(403).json({ message: "Only freelancers can save or unsave jobs." });
  }

  if (!job_id) {
    return res.status(400).json({ message: "Job ID is required." });
  }

  try {
    const db = await connectDB();

    // Check if job exists
    const job = await db.query("SELECT * FROM jobs WHERE id = $1", [job_id]);
    if (job.rows.length === 0) {
      return res.status(404).json({ message: "Job not found." });
    }

    // Check if already saved
    const existing = await db.query(
      "SELECT * FROM saved_jobs WHERE freelancer_id = $1 AND job_id = $2",
      [user_id, job_id]
    );

    if (existing.rows.length > 0) {
      // Unsave job
      await db.query(
        "DELETE FROM saved_jobs WHERE freelancer_id = $1 AND job_id = $2",
        [user_id, job_id]
      );
      return res.status(200).json({
        message: "Job unsaved successfully.",
        action: "unsaved",
        jobId: job_id
      });
    } else {
      // Save job
      await db.query(
        "INSERT INTO saved_jobs (freelancer_id, job_id) VALUES ($1, $2)",
        [user_id, job_id]
      );
      return res.status(201).json({
        message: "Job saved successfully.",
        action: "saved",
        jobId: job_id
      });
    }

  } catch (error) {
    console.error("Error toggling save job:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Get all saved jobs for a freelancer
export async function getSavedJobs(req, res) {
  const user = req.user;
  const user_id = user.id;

  try {
    const db = await connectDB();

    const result = await db.query(
      `
      SELECT 
        jobs.id,
        jobs.title,
        jobs.description,
        jobs.budget,
        jobs.category,
        jobs.deadline,
        jobs.created_at,
        users.first_name AS client_first_name,
        users.last_name AS client_last_name
      FROM saved_jobs
      JOIN jobs ON saved_jobs.job_id = jobs.id
      JOIN users ON jobs.client_id = users.id
      WHERE saved_jobs.freelancer_id = $1
      ORDER BY saved_jobs.saved_at DESC
      `,
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ message: "No saved jobs found.", jobs: [] });
    }

    return res.status(200).json({ jobs: result.rows });
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Delete a saved job
export async function deleteSavedJob(req, res) {
  const user = req.user;
  const user_id = user.id;
  const user_role = user.role;
  const { job_id } = req.params;

  if (user_role !== 'freelancer') {
    return res.status(403).json({ message: "Only freelancers can delete saved jobs." });
  }

  if (!job_id) {
    return res.status(400).json({ message: "Job ID is required." });
  }

  try {
    const db = await connectDB();

    // Check if saved job exists
    const existing = await db.query(
      "SELECT * FROM saved_jobs WHERE freelancer_id = $1 AND job_id = $2",
      [user_id, job_id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Saved job not found." });
    }

    // Delete saved job
    await db.query(
      "DELETE FROM saved_jobs WHERE freelancer_id = $1 AND job_id = $2",
      [user_id, job_id]
    );

    return res.status(200).json({
      message: "Saved job deleted successfully.",
      jobId: job_id
    });
  } catch (error) {
    console.error("Error deleting saved job:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
