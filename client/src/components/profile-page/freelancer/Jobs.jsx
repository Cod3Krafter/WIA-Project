import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../lib/axios";
import AppliedJobsCard from "../user-profile-page/AppliedJobsCard.jsx";
import SavedJobsCard from "../user-profile-page/SavedJobsCard.jsx";
import PostedJobsCard from "../client/PostedJobsCard.jsx";
import JobApplicantsModal from "../client/JobApplicantsModal.jsx";
import JobPostForm from "../client/JobPostForm.jsx";
import JobApplyModal from "../../home-page/JobApplyModal.jsx";
import EmptyState from "../../EmptyState.jsx";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/useAuth";
import EditPostedJobModal from "../client/EditPostedJobModal.jsx";
import { DeletePostedJobModal } from "../client/DeletePostedJobModal.jsx";
import { tabVariants, itemVariants,fadeInUp, modalVariant } from "../../ui/animations.jsx";


const Jobs = () => {
  const { activeRole } = useAuth();
  const [activeTab, setActiveTab] = useState("");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [applyJob, setApplyJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [postedJobs, setPostedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [showModal, setShowApplicantsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const handleViewJob = async (job) => {
    try {
      setSelectedJob(job);
      setShowApplicantsModal(true);
      const res = await api.get(`/job-applications/job/${job.id}`);
      setApplicants(res.data || []);
      setSelectedApplicant(null);
    } catch (err) {
      console.error("Failed to fetch applicants", err);
    }
  };

  const handleApplyClick = (job) => {
    setApplyJob(job);
    document.getElementById("apply-modal")?.showModal();
  };

  const handleDeleteSavedJob = async (id) => {
    try {
      const res = await api.delete(`/saved-jobs/delete/${id}`);
      setSavedJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
      toast.success("Job deleted");
    } catch (error) {
      console.log("Error occured", error);
    }
  };

  const handleDeleteAppliedJob = (deletedJobId) => {
    setAppliedJobs((prev) => prev.filter((job) => job.job_id !== deletedJobId));
  };

  const tabs = useMemo(() => {
    return activeRole === "freelancer"
      ? ["Applied Jobs", "Saved Jobs"]
      : ["Post Job", "Posted Jobs"];
  }, [activeRole]);

  const handleEditModal = (job) => {
    setSelectedJob(job);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleSaveEditedJob = async (updatedJob) => {
    try {
      await api.put(`/jobs/${updatedJob.id}`, updatedJob);

      const res = await api.get("/jobs/user");
      setPostedJobs(Array.isArray(res.data) ? res.data : []);

      toast.success("Job updated successfully!");
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to update job:", err);
      toast.error("Failed to update job.");
    }
  };

  const handleDeleteJobClick = (postedJob) => {
    setSelectedJob(postedJob);
    setShowDeleteModal(true);
  };

  const handleDeleteSuccess = (deletedJobId) => {
    setPostedJobs((prev) => prev.filter((job) => job.id !== deletedJobId));
    setShowDeleteModal(false);
  };

  useEffect(() => {
    if (tabs.length > 0) {
      setActiveTab(tabs[0]);
    }
  }, [tabs]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        let res;

        if (activeTab === "Applied Jobs") {
          res = await api.get("/job-applications/user");
          const data = Array.isArray(res.data.applications)
            ? res.data.applications
            : [];
          setAppliedJobs(data);
        } else if (activeTab === "Saved Jobs") {
          res = await api.get("/saved-jobs");
          const data = Array.isArray(res.data.jobs) ? res.data.jobs : [];
          setSavedJobs(data);
        } else if (activeTab === "Posted Jobs") {
          res = await api.get("/jobs/user");
          const data = Array.isArray(res.data) ? res.data : [];
          setPostedJobs(data);
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setAppliedJobs([]);
        setSavedJobs([]);
        setPostedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab && activeTab !== "Post Job") {
      fetchJobs();
    }
  }, [activeTab, activeRole]);

  return (
    <motion.div
      className="p-4 space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Tabs */}
      <motion.div 
        className="flex overflow-x-auto border-b border-base-300 mb-6"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex min-w-max">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab}
              className={`px-4 py-3 text-xl font-medium whitespace-nowrap border-b-2 transition-colors
                ${
                  activeTab === tab
                    ? "border-blue-500/70 text-blue-500"
                    : "border-transparent text-base-content/70 hover:text-base-content hover:border-base-content/30"
                }`}
                variants={tabVariants}
                animate={activeTab === tab ? "active" : "inactive"}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                onClick={() => setActiveTab(tab)}
              >
              <motion.span 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {tab}
              </motion.span>
            </motion.button>
          ))}
        </div>
      </motion.div>



      {/* Content */}
      <div className="p-4 bg-base-100 rounded-md shadow">
        {activeTab === "Post Job" ? (
          <JobPostForm />
        ) : loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {activeTab === "Saved Jobs" && (
                savedJobs.length > 0 ? (
                  savedJobs.map((job, index) => (
                    <motion.div
                      key={job.id || index}
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: 20 }}
                      custom={index}
                    >
                      <SavedJobsCard
                        savedJob={job}
                        onApply={() => handleApplyClick(job)}
                        onDelete={(id) => handleDeleteSavedJob(id)}
                      />
                    </motion.div>
                  ))
                ) : (
                  <EmptyState message="No saved jobs yet." />
                )
              )}

              {activeTab === "Applied Jobs" && (
                appliedJobs.length > 0 ? (
                  appliedJobs.map((job, index) => (
                    <motion.div
                      key={job.job_id || index}
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: 20 }}
                      custom={index}
                    >
                      <AppliedJobsCard
                        appliedJob={job}
                        onApplicationDeleted={handleDeleteAppliedJob}
                      />
                    </motion.div>
                  ))
                ) : (
                  <EmptyState message="You haven’t applied to any jobs yet." />
                )
              )}

              {activeTab === "Posted Jobs" && (
                postedJobs.length > 0 ? (
                  postedJobs.map((postedJob, index) => (
                    <motion.div
                      key={postedJob.id || index}
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: 20 }}
                      custom={index}
                    >
                      <PostedJobsCard
                        postedJob={postedJob}
                        onViewApplicants={handleViewJob}
                        onEditJob={handleEditModal}
                        onDeleteJob={handleDeleteJobClick}
                      />
                    </motion.div>
                  ))
                ) : (
                  <EmptyState message="No jobs posted yet." />
                )
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Modals with animation */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            key="applicantsModal"
            variants={modalVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <JobApplicantsModal
              show={showModal}
              onClose={() => setShowApplicantsModal(false)}
              job={selectedJob}
              applicants={applicants}
              selectedApplicant={selectedApplicant}
              setSelectedApplicant={setSelectedApplicant}
            />
          </motion.div>
        )}

        {showEditModal && selectedJob && (
          <motion.div
            key="editModal"
            variants={modalVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <EditPostedJobModal
              job={selectedJob}
              onClose={handleCloseEditModal}
              onSave={handleSaveEditedJob}
            />
          </motion.div>
        )}

        {showDeleteModal && selectedJob && (
          <motion.div
            key="deleteModal"
            variants={modalVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <DeletePostedJobModal
              job={selectedJob}
              onClose={() => setShowDeleteModal(false)}
              onDeleteSuccess={handleDeleteSuccess}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Job Apply Modal stays native */}
      <JobApplyModal selectedJob={applyJob} />
    </motion.div>
  );
};

export default Jobs;
