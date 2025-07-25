import { connectDB } from "../config/db.js";
import { applyToJobSchema } from "../schemas/jobApplicationInputValidation.js";

export async function applyToJob(req, res) {
  const user = req.user;
  const user_id = user.id;
  const user_role = user.role;
  const { job_id, proposal, expected_budget, freelancer_contact } = req.body;

  if (user_role !== 'freelancer') {
    return res.status(403).json({ message: "Only freelancers can apply for jobs." });
  }

  if (!job_id || !proposal || !expected_budget || !freelancer_contact) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {

    await applyToJobSchema.validate(req.body, { abortEarly: false });

    const db = await connectDB();

    // Step 1: Get job title
    const job = await new Promise((resolve, reject) => {
      db.get("SELECT title FROM jobs WHERE id = ?", [job_id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!job) {
      db.close();
      return res.status(404).json({ message: "Job not found." });
    }

    // Step 2: Check if already applied
    const existing = await new Promise((resolve, reject) => {
      db.get(
        "SELECT id FROM job_applications WHERE job_id = ? AND freelancer_id = ?",
        [job_id, user_id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (existing) {
      db.close();
      return res.status(409).json({ message: "You have already applied for this job." });
    }

    // Step 3: Insert application
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO job_applications 
        (job_id, freelancer_id, job_title, proposal, expected_budget, freelancer_contact)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [job_id, user_id, job.title, proposal, expected_budget, freelancer_contact],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    db.close();
    return res.status(201).json({ message: "Application submitted successfully." });

  } catch (error) {
    console.error("Error submitting application:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors
      });
    }
    
    return res.status(500).json({ message: "Internal server error." });
  }
}


export async function getApplicationsForJob(req, res) {
  const user = req.user;
  const user_id = user.id;
  const user_role = user.role;
  const { job_id } = req.params;

  if (user_role !== 'client') {
    return res.status(403).json({ message: "Only clients can view applications for their jobs." });
  }

  try {
    const db = await connectDB();

    // Check if the job belongs to this client
    const job = await new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM jobs WHERE id = ? AND client_id = ?",
        [job_id, user_id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!job) {
      db.close();
      return res.status(403).json({ message: "You do not have access to this job's applications." });
    }

    // Get all applications for the job
    const applications = await new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM job_applications WHERE job_id = ? ORDER BY submitted_at DESC",
        [job_id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    db.close();
    return res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMyJobApplications(req, res) {
  const user = req.user;
  const user_id = user.id;
  const user_role = user.role;

  if (user_role !== 'freelancer') {
    return res.status(403).json({ message: "Only freelancers can view their job applications." });
  }

  try {
    const db = await connectDB();

    const applications = await new Promise((resolve, reject) => {
      db.all(
        `SELECT job_id, job_title, proposal, expected_budget, submitted_at
         FROM job_applications
         WHERE freelancer_id = ?
         ORDER BY submitted_at DESC`,
        [user_id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    db.close();

    if (!applications || applications.length === 0) {
      return res.status(200).json({ message: "You have not applied to any jobs yet.", applications: [] });
    }

    return res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


