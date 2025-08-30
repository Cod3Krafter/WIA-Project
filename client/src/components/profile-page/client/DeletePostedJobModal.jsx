import React from "react";
import toast from "react-hot-toast";
import api from "../../../lib/axios";

export const DeletePostedJobModal = ({ job, onClose, onDeleteSuccess }) => {
  console.log("Job to delete:", job.id)
  console.log("Selected job for deletion",job)

  const handleDelete = async () => {
    try {
      await api.delete(`/jobs/${job.id}`);
      onDeleteSuccess(job.id);
      toast.success("Job deleted successfully!");
    } catch (error) {
      console.error("Failed to delete job:", error);
      toast.error(error.response?.data?.message || "Failed to delete job.");
    }
  };

  if (!job) return null;

  return (
    <dialog open className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-red-600">Delete Job</h3>
        <p className="py-4">
          Are you sure you want to delete the job <b>{job.title}</b>?  
          This action cannot be undone.
        </p>

        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btn btn-error"
            onClick={handleDelete}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </dialog>
  );
};