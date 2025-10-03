import { connectDB } from "../config/db.js";

// ----------------------------------------------------
// Get Job Status
// ----------------------------------------------------
export async function getJobStatus(req, res) {
  const user = req.user;
  const user_id = user.id;
  const { jobId } = req.params;

  if (!jobId || !user_id) {
    return res.status(400).json({ message: "Job ID and User ID are required." });
  }

  try {
    const db = await connectDB();

    const result = await db.query(
      `SELECT status 
       FROM job_applications
       WHERE job_id = $1 AND freelancer_id = $2`,
      [jobId, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Application not found." });
    }

    return res.status(200).json({ status: result.rows[0].status });
  } catch (error) {
    console.error("Error fetching job status:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

// ----------------------------------------------------
// Hire Freelancer
// ----------------------------------------------------
export async function hireFreelancer(req, res) {
  const user = req.user;
  const user_id = user.id;
  const selectedRole = req.headers["x-active-role"];
  const { applicationId } = req.params;

  if (selectedRole !== "client") {
    return res.status(403).json({ message: "Only clients can hire freelancers." });
  }

  if (!applicationId) {
    return res.status(400).json({ message: "Application ID is required." });
  }

  try {
    const db = await connectDB();

    // Step 1: Get application details
    const appResult = await db.query(
      `SELECT job_id, freelancer_id, status 
       FROM job_applications 
       WHERE id = $1`,
      [applicationId]
    );
    const application = appResult.rows[0];

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    // Step 2: Ensure client owns the job
    const jobResult = await db.query(
      `SELECT client_id 
       FROM jobs 
       WHERE id = $1`,
      [application.job_id]
    );
    const job = jobResult.rows[0];

    if (!job || job.client_id !== user_id) {
      return res.status(403).json({ message: "You are not authorized to hire for this job." });
    }

    // Step 3: Check if already hired
    const hireResult = await db.query(
      `SELECT id 
       FROM job_applications 
       WHERE job_id = $1 AND status = 'hired'`,
      [application.job_id]
    );

    if (hireResult.rows.length > 0) {
      return res.status(409).json({ message: "A freelancer has already been hired for this job." });
    }

    // Step 4: Hire this freelancer
    await db.query(
      `UPDATE job_applications
       SET status = 'hired'
       WHERE id = $1`,
      [applicationId]
    );

    // Step 5: Reject all other applications
    await db.query(
      `UPDATE job_applications
       SET status = 'rejected'
       WHERE job_id = $1 AND id != $2`,
      [application.job_id, applicationId]
    );

    // Step 6: Update job status
    await db.query(
      `UPDATE jobs
       SET status = 'closed'
       WHERE id = $1`,
      [application.job_id]
    );

    return res.status(200).json({ message: "Freelancer hired successfully." });
  } catch (error) {
    console.error("Error hiring freelancer:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

// ----------------------------------------------------
// Reject Freelancer
// ----------------------------------------------------
export async function rejectFreelancer(req, res) {
  const user = req.user;
  const user_id = user.id;
  const selectedRole = req.headers["x-active-role"];
  const { applicationId } = req.params;

  if (selectedRole !== "client") {
    return res.status(403).json({ message: "Only clients can reject freelancers." });
  }

  if (!applicationId) {
    return res.status(400).json({ message: "Application ID is required." });
  }

  try {
    const db = await connectDB();

    // Step 1: Get application details
    const appResult = await db.query(
      `SELECT job_id, freelancer_id, status 
       FROM job_applications 
       WHERE id = $1`,
      [applicationId]
    );
    const application = appResult.rows[0];

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    // Step 2: Ensure client owns the job
    const jobResult = await db.query(
      `SELECT client_id 
       FROM jobs 
       WHERE id = $1`,
      [application.job_id]
    );
    const job = jobResult.rows[0];

    if (!job || job.client_id !== user_id) {
      return res.status(403).json({ message: "You are not authorized to reject applications for this job." });
    }

    // Step 3: Reject this freelancer
    await db.query(
      `UPDATE job_applications
       SET status = 'rejected'
       WHERE id = $1`,
      [applicationId]
    );

    return res.status(200).json({ message: "Freelancer rejected successfully." });
  } catch (error) {
    console.error("Error rejecting freelancer:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
