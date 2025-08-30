import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../../lib/axios";
import { Trash2, DollarSign } from "lucide-react";
import { DeleteAppliedJobModal } from "../freelancer/DeleteAppliedJobModal.jsx";
import { 
  projectCardVariants, 
  buttonVariants, 
  badgeVariants 
} from "../../../components/ui/animations.jsx";

const AppliedJobsCard = ({ appliedJob, onApplicationDeleted = () => {} }) => {
  const [status, setStatus] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get(`/application-status/${appliedJob.job_id}/status`);
        setStatus(res.data.status);
      } catch (error) {
        console.error("Error fetching job status:", error);
        setStatus("unknown");
      }
    };

    if (appliedJob?.job_id) fetchStatus();
  }, [appliedJob]);

  const handleDeleteSuccess = (deletedJobId) => {
    setShowDeleteModal(false);
    if (typeof onApplicationDeleted === 'function') {
      onApplicationDeleted(deletedJobId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "hired": return "bg-green-500";
      case "rejected": return "bg-red-500";
      case "pending": return "bg-yellow-500";
      default: return "bg-blue-500";
    }
  };

  return (
    <motion.div 
      className="p-6 bg-base-200 border border-base-300 rounded-xl hover:shadow-lg transition-all duration-300"
      variants={projectCardVariants}
      whileHover="hover"
      layout
    >
      <div className="space-y-4">
        {/* Header with title and status */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold text-white flex-1">
            {appliedJob.job_title}
          </h3>
          <span className="flex gap-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(status)}`}>
              {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Loading"}
            </div>
            {/* Delete button for rejected applications */}
            {status === "rejected" && (
                <Trash2 
                  className="size-7 text-red-600 "
                  onClick={() => setShowDeleteModal(true)}
                   />
            )}
          </span>
        </div>

        {/* Proposal */}
        <div>
          <p className="text-gray-200 leading-relaxed line-clamp-3">
            {appliedJob.proposal}
          </p>
        </div>

        {/* Bottom section with budget and date */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className="font-semibold text-green-600">
              ${appliedJob.expected_budget}
            </span>
          </div>
          
          <span className="text-sm text-white">
            {new Date(appliedJob.submitted_at).toLocaleDateString()}
          </span>
        </div>

      </div>

      {showDeleteModal && (
        <DeleteAppliedJobModal
          appliedJob={appliedJob}
          onClose={() => setShowDeleteModal(false)}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </motion.div>
  );
};

export default AppliedJobsCard;