import { connectDB } from "../config/db.js";
import { applyToJobSchema } from "../schemas/jobApplicationInputValidation.js";

// Apply to a job
export async function applyToJob(req, res) {
  const user = req.user;
  const user_id = user.id;
  const selectedRole = req.headers["x-active-role"];
  const { job_id, proposal, expected_budget, freelancer_contact } = req.body;

  if (selectedRole !== "freelancer") {
    return res.status(403).json({ message: "Only freelancers can apply for jobs." });
  }

  if (!job_id || !proposal || !expected_budget || !freelancer_contact) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    await applyToJobSchema.validate(req.body, { abortEarly: false });

    const db = await connectDB();

    // Step 1: Get job title
    const jobResult = await db.query("SELECT title FROM jobs WHERE id = $1", [job_id]);
    if (jobResult.rowCount === 0) {
      return res.status(404).json({ message: "Job not found." });
    }
    const job = jobResult.rows[0];

    // Step 2: Check if already applied
    const existingResult = await db.query(
      "SELECT id FROM job_applications WHERE job_id = $1 AND freelancer_id = $2",
      [job_id, user_id]
    );
    if (existingResult.rowCount > 0) {
      return res.status(409).json({ message: "You have already applied for this job." });
    }

    // Step 3: Insert application
    await db.query(
      `INSERT INTO job_applications 
        (job_id, freelancer_id, job_title, proposal, expected_budget, freelancer_contact)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [job_id, user_id, job.title, proposal, expected_budget, freelancer_contact]
    );

    return res.status(201).json({ message: "Application submitted successfully." });
  } catch (error) {
    console.error("Error submitting application:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation failed", errors: error.errors });
    }

    return res.status(500).json({ message: "Internal server error." });
  }
}

// Get all applications for a specific job (for clients)
export async function getApplicationsForJob(req, res) {
  const user = req.user;
  const user_id = user.id;
  const selectedRole = req.headers["x-active-role"];
  const { job_id } = req.params;

  if (selectedRole !== "client") {
    return res.status(403).json({ message: "Only clients can view applications for their jobs." });
  }

  try {
    const db = await connectDB();

    // Check if the job belongs to this client
    const jobResult = await db.query("SELECT * FROM jobs WHERE id = $1 AND client_id = $2", [
      job_id,
      user_id,
    ]);

    if (jobResult.rowCount === 0) {
      return res
        .status(403)
        .json({ message: "You do not have access to this job's applications." });
    }

    // Get all applications for the job
    const appsResult = await db.query(
      `SELECT ja.*, u.first_name, u.last_name
       FROM job_applications ja
       JOIN users u ON ja.freelancer_id = u.id
       WHERE ja.job_id = $1
       ORDER BY ja.submitted_at DESC`,
      [job_id]
    );

    const formatted = appsResult.rows.map((row) => {
      const { first_name, last_name, ...rest } = row;
      return { ...rest, user: { first_name, last_name } };
    });

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Get applications of the logged-in freelancer
export async function getMyJobApplications(req, res) {
  const user = req.user;
  const user_id = user.id;
  const selectedRole = req.headers["x-active-role"];

  if (!selectedRole || selectedRole !== "freelancer") {
    return res
      .status(403)
      .json({ message: "Only freelancers can view their job applications." });
  }

  try {
    const db = await connectDB();

    const appsResult = await db.query(
      `SELECT job_id, job_title, proposal, expected_budget, submitted_at
       FROM job_applications
       WHERE freelancer_id = $1
       ORDER BY submitted_at DESC`,
      [user_id]
    );

    if (appsResult.rowCount === 0) {
      return res
        .status(200)
        .json({ message: "You have not applied to any jobs yet.", applications: [] });
    }

    return res.status(200).json({ applications: appsResult.rows });
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Delete a job application
export async function deleteJobApplication(req, res) {
  const user = req.user;
  const user_id = user.id;
  const { jobId } = req.params;
  const selectedRole = req.headers["x-active-role"];

  if (!selectedRole || selectedRole !== "freelancer") {
    return res.status(403).json({ message: "Only freelancers can delete their job applications." });
  }

  if (!jobId) {
    return res.status(400).json({ message: "Job ID is required." });
  }

  try {
    const db = await connectDB();

    // Ensure the application belongs to this freelancer
    const appResult = await db.query(
      `SELECT id FROM job_applications WHERE job_id = $1 AND freelancer_id = $2`,
      [jobId, user_id]
    );

    if (appResult.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Application not found or you are not authorized to delete it." });
    }

    // Delete the application
    await db.query(`DELETE FROM job_applications WHERE job_id = $1 AND freelancer_id = $2`, [
      jobId,
      user_id,
    ]);

    return res.status(200).json({ message: "Job application deleted successfully." });
  } catch (error) {
    console.error("Error deleting job application:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
