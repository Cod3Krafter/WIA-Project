import React from "react";
import toast from "react-hot-toast";
import api from "../../../lib/axios";

const RejectApplicantModal = ({ onClose, selectedApplicant, onSuccess }) => {
  const confirmReject = async (id) => {
    try {
      await api.patch(`/application-status/${id}/reject`);
      toast.success("Applicant rejected!");
      onSuccess(); // Call onSuccess to update local state
      console.log("Rejected applicant:", id);
    } catch (error) {
      toast.error("Hmmmm that didn't work 🤔");
      console.error("Error rejecting applicant:", error.response?.data || error.message);
    }
  };

  return (
    <div className="fixed inset-0 text-secondary bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-lg w-[90%] max-w-md space-y-4">
        <h2 className="text-xl font-semibold text-error">Reject Applicant</h2>
        <p>Are you sure you want to reject this applicant?</p>

        <div className="bg-base-200 p-3 rounded-lg">
          <p className="font-medium text-lg">
            {selectedApplicant.user?.first_name} {selectedApplicant.user?.last_name}
          </p>
        </div>

        <p className="text-sm text-warning">
          ⚠️ This action cannot be undone. The applicant will be marked as
          <span className="font-semibold"> "Rejected"</span>.
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-error"
            onClick={() => confirmReject(selectedApplicant.id)}
          >
            Confirm Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectApplicantModal;