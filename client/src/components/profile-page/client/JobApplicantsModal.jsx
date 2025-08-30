import React, { useState } from "react";
import { useEffect } from "react";
import {CircleX} from 'lucide-react'
import HireApplicantModal from "./HireApplicantModal"; 
import RejectApplicantModal from "./RejectApplicantModal";

const JobApplicantsModal = ({
  show,
  onClose,
  job,
  applicants,
  selectedApplicant,
  setSelectedApplicant,
  onApplicantUpdate, // Add this prop to refresh applicants
}) => {

  const [showHireModal, setShowHireModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [localApplicants, setLocalApplicants] = useState(applicants)

  // Update local applicants when prop changes
  useEffect(() => {
    setLocalApplicants(applicants);
  }, [applicants]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  if (!show || !job) return null;

  const handleHireClick = () => {
    setShowHireModal(true);
  };
  
  const handleRejectClick = () => {
    setShowRejectModal(true);
  };

  const handleHireSuccess = () => {
    setShowHireModal(false);
    
    // Update local applicants array - hire selected, reject all others
    const updatedApplicants = localApplicants.map(applicant => {
      if (applicant.id === selectedApplicant.id) {
        return { ...applicant, status: 'hired' };
      } else if (applicant.status === 'pending') {
        return { ...applicant, status: 'rejected' };
      }
      return applicant;
    });
    setLocalApplicants(updatedApplicants);
    
    // Update selected applicant
    if (selectedApplicant) {
      setSelectedApplicant({
        ...selectedApplicant,
        status: 'hired'
      });
    }
    
    // Call the callback to refresh the applicants list in parent
    if (onApplicantUpdate) {
      onApplicantUpdate();
    }
  };

  const handleRejectSuccess = () => {
    setShowRejectModal(false);
    
    // Update local applicants array
    const updatedApplicants = localApplicants.map(applicant => 
      applicant.id === selectedApplicant.id 
        ? { ...applicant, status: 'rejected' }
        : applicant
    );
    setLocalApplicants(updatedApplicants);
    
    // Update selected applicant
    if (selectedApplicant) {
      setSelectedApplicant({
        ...selectedApplicant,
        status: 'rejected'
      });
    }
    
    // Call the callback to refresh the applicants list in parent
    if (onApplicantUpdate) {
      onApplicantUpdate();
    }
  };

  console.log(selectedApplicant)

  return (
    <div className="fixed h-full inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 text-black">
      <div className="bg-white flex flex-col gap-3 p-6 w-full max-w-4xl rounded-lg shadow-lg ">
        <div className="flex justify-end">
          <CircleX 
            className="size-9 text-gray-500 hover:text-gray-800"
            onClick={onClose}
          />
        </div>
        <div className="flex overflow-hidden">
          {/* Applicants List */}
          <div className="w-1/3 max-h-[400px] min-h-[400px] border-r pr-4 overflow-y-auto">
            <h3 className="text-3xl font-bold mb-2">Applicants</h3>
            {localApplicants.length === 0 ? (
              <p className="text-sm text-gray-500">No applicants yet.</p>
            ) : (
              localApplicants.map((applicant, idx) => (
                <div
                  key={idx}
                  className={`flex justify-between p-3 rounded-lg cursor-pointer ${
                    selectedApplicant?.id === applicant.id
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedApplicant(applicant)}
                >
                  <p className="font-medium">
                    {applicant.user?.first_name} {applicant.user?.last_name}
                  </p>
                  <div
                    className={`badge badge-outline 
                      ${applicant.status === "hired" ? "badge-success" : ""} 
                      ${applicant.status === "rejected" ? "badge-error" : ""} 
                      ${applicant.status === "pending" ? "badge-warning" : ""}`}
                  >
                    {applicant.status}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Proposal Viewer */}
          <div className="w-2/3 pl-4 relative overflow-y-auto min-h-[400px]">
            {selectedApplicant ? (
              <div className="flex flex-col ">
                <span className="flex flex-col gap-2 p-2 bg-base-100/10">
                  <p className="text-3xl font-extrabold">
                    Proposed budget
                  </p>
                  <p className="text-2xl font-semibold">
                  ${selectedApplicant.expected_budget || "No budget submitted."}
                  </p>
                </span>
                <div className="flex flex-col gap-2 mt-4 p-2">
                  <p className="text-3xl font-extrabold">
                    Proposal
                  </p>
                  <p className="text-gray-700 whitespace-pre-line">
                    {selectedApplicant.proposal || "No proposal submitted."}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">
                Select an applicant to view their proposal.
              </p>
            )}
            {selectedApplicant && selectedApplicant.status === 'pending' && (
                <div className="absolute bottom-3">
                  <button 
                    onClick={handleHireClick}
                    className="min-w-[150px] px-4 py-2 text-lg bg-blue-500 hover:bg-blue-600 text-white rounded">
                    Hire
                  </button>
                  <button 
                    onClick={handleRejectClick}
                    className="min-w-[150px] px-4 py-2 text-lg bg-red-500 hover:bg-red-600 text-white rounded ml-2">
                    Reject
                  </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showHireModal && selectedApplicant && (
        <HireApplicantModal
          selectedApplicant={selectedApplicant}
          allApplicants={localApplicants}
          onClose={() => setShowHireModal(false)}
          onSuccess={handleHireSuccess}
        />
      )}
      {showRejectModal && selectedApplicant && (
        <RejectApplicantModal
          selectedApplicant={selectedApplicant}
          onClose={() => setShowRejectModal(false)}
          onSuccess={handleRejectSuccess}
        />
      )}
    </div>
  );
};

export default JobApplicantsModal;