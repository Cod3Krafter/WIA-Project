import React from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../../lib/axios";
import { 
  overlayVariants, 
  modalVariants 
} from "../../../components/ui/animations.jsx";

export const DeleteAppliedJobModal = ({ 
  appliedJob, 
  onClose, 
  onDeleteSuccess = () => {} // Default empty function
}) => {
  if (!appliedJob) return null;

  const handleDelete = async () => {
    try {
      await api.delete(`/job-applications/user/${appliedJob.job_id}`);
      
      // Check if onDeleteSuccess is a function before calling
      onDeleteSuccess(appliedJob.job_id);

      // Close the modal after successful deletion
      onClose();
      toast.success("Job application deleted!");
    } catch (error) {
      console.error("Failed to delete application:", error);
      toast.error(error.response?.data?.message || "Failed to delete application.");
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-6"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div 
        className="bg-base-100 p-8 sm:p-10 rounded-2xl w-full max-w-2xl mx-4 space-y-6"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.h3 
          className="text-2xl sm:text-3xl font-bold text-error"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Delete Application
        </motion.h3>

        <motion.p 
          className="text-lg sm:text-xl"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          Are you sure you want to delete your application for this job?
        </motion.p>

        <motion.div 
          className="bg-base-200 p-5 rounded-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="font-semibold text-xl sm:text-2xl break-words">
            {appliedJob.job_title}
          </p>
          <p className="text-base sm:text-lg text-base-content/70 break-words mt-2">
            <span className="font-medium">Proposal:</span> {appliedJob.proposal}
          </p>
          <p className="text-base sm:text-lg text-base-content/70 break-words mt-1">
            <span className="font-medium">Budget:</span> ${appliedJob.expected_budget}
          </p>
        </motion.div>

        <motion.p 
          className="text-base sm:text-lg text-warning"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          ⚠️ This action cannot be undone.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row justify-end gap-4 pt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            className="px-8 py-4 text-blue-600 font-medium rounded-lg bg-primary hover:bg-black hover:transform-[scale(1.05)] hover:text-white transition-colors duration-200 focus:outline-none focus:transform-[scale(0.95)] focus:ring-offset-2"
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button
            className="px-8 py-4 text-error font-medium rounded-lg bg-primary hover:bg-black hover:transform-[scale(1.05)] hover:text-white transition-colors duration-200 focus:outline-none focus:transform-[scale(0.95)] focus:ring-offset-2"
            onClick={handleDelete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Yes, Delete
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};