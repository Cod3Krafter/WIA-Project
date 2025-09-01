import { connectDB } from "../config/db.js"; 

export async function getJobStatus(req, res) {
  const user = req.user;
  const user_id = user.id;
  const { jobId } = req.params;

  if (!jobId || !user_id) {
    return res.status(400).json({ message: "Job ID and User ID are required." });
  }

  try {
    const db = await connectDB();

    const status = await new Promise((resolve, reject) => {
      db.get(
        `SELECT status 
         FROM job_applications
         WHERE job_id = ? AND freelancer_id = ?`,
        [jobId, user_id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    db.close();

    if (!status) {
      return res.status(404).json({ message: "Application not found." });
    }

    console.log(status)

    return res.status(200).json({ status: status.status });
  } catch (error) {
    console.error("Error fetching job status:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

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
    const application = await new Promise((resolve, reject) => {
      db.get(
        `SELECT job_id, freelancer_id, status 
         FROM job_applications 
         WHERE id = ?`,
        [applicationId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!application) {
      db.close();
      return res.status(404).json({ message: "Application not found." });
    }

    // Step 2: Ensure client owns the job
    const job = await new Promise((resolve, reject) => {
      db.get(
        `SELECT client_id 
         FROM jobs 
         WHERE id = ?`,
        [application.job_id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!job || job.client_id !== user_id) {
      db.close();
      return res.status(403).json({ message: "You are not authorized to hire for this job." });
    }

    // Step 3: Check if already hired
    const existingHire = await new Promise((resolve, reject) => {
      db.get(
        `SELECT id FROM job_applications 
         WHERE job_id = ? AND status = 'hired'`,
        [application.job_id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (existingHire) {
      db.close();
      return res.status(409).json({ message: "A freelancer has already been hired for this job." });
    }

    // Step 4: Hire this freelancer
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE job_applications
         SET status = 'hired'
         WHERE id = ?`,
        [applicationId],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Step 5: Reject all other applications for this job
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE job_applications
         SET status = 'rejected'
         WHERE job_id = ? AND id != ?`,
        [application.job_id, applicationId],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // ✅ Step 6: Update job status in jobs table
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE jobs
         SET status = 'closed'
         WHERE id = ?`,
        [application.job_id],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    db.close();
    return res.status(200).json({ message: "Freelancer hired successfully." });

  } catch (error) {
    console.error("Error hiring freelancer:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

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
    const application = await new Promise((resolve, reject) => {
      db.get(
        `SELECT job_id, freelancer_id, status 
         FROM job_applications 
         WHERE id = ?`,
        [applicationId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!application) {
      db.close();
      return res.status(404).json({ message: "Application not found." });
    }

    // Step 2: Ensure client owns the job
    const job = await new Promise((resolve, reject) => {
      db.get(
        `SELECT client_id 
         FROM jobs 
         WHERE id = ?`,
        [application.job_id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!job || job.client_id !== user_id) {
      db.close();
      return res.status(403).json({ message: "You are not authorized to reject applications for this job." });
    }

    // Step 3: Update application status to rejected
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE job_applications
         SET status = 'rejected'
         WHERE id = ?`,
        [applicationId],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    db.close();
    return res.status(200).json({ message: "Freelancer rejected successfully." });

  } catch (error) {
    console.error("Error rejecting freelancer:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

