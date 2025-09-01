import { connectDB } from "../config/db.js";

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

    const job = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM jobs WHERE id = ?", [job_id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!job) {
      db.close();
      return res.status(404).json({ message: "Job not found." });
    }

    const existing = await new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM saved_jobs WHERE freelancer_id = ? AND job_id = ?",
        [user_id, job_id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (existing) {
      // Unsave the job
      await new Promise((resolve, reject) => {
        db.run(
          "DELETE FROM saved_jobs WHERE freelancer_id = ? AND job_id = ?",
          [user_id, job_id],
          function (err) {
            if (err) reject(err);
            else resolve();
          }
        );
      });

      db.close();
      return res.status(200).json({ 
        message: "Job unsaved successfully.",
        action: "unsaved",
        jobId: job_id
      });
    } else {
      // Save the job
      await new Promise((resolve, reject) => {
        db.run(
          "INSERT INTO saved_jobs (freelancer_id, job_id) VALUES (?, ?)",
          [user_id, job_id],
          function (err) {
            if (err) reject(err);
            else resolve();
          }
        );
      });

      db.close();
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

export async function getSavedJobs(req, res) {
  const user = req.user;
  const user_id = user.id;

  try {
    const db = await connectDB();

    const savedJobs = await new Promise((resolve, reject) => {
      db.all(
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
        WHERE saved_jobs.freelancer_id = ?
        ORDER BY saved_jobs.saved_at DESC
        `,
        [user_id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    db.close();

    if (!savedJobs || savedJobs.length === 0) {
      return res.status(200).json({ message: "No saved jobs found.", jobs: [] });
    }

    return res.status(200).json({ jobs: savedJobs });
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

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

    const existing = await new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM saved_jobs WHERE freelancer_id = ? AND job_id = ?",
        [user_id, job_id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!existing) {
      db.close();
      return res.status(404).json({ message: "Saved job not found." });
    }

    await new Promise((resolve, reject) => {
      db.run(
        "DELETE FROM saved_jobs WHERE freelancer_id = ? AND job_id = ?",
        [user_id, job_id],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    db.close();
    return res.status(200).json({
      message: "Saved job deleted successfully.",
      jobId: job_id
    });

  } catch (error) {
    console.error("Error deleting saved job:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
