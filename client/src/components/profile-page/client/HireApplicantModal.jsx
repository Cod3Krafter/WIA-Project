import React from 'react'
import toast from 'react-hot-toast'
import api from '../../../lib/axios'

const HireApplicantModal = ({onClose, selectedApplicant, onSuccess, allApplicants}) => {
    const confirmHire = async (id) => {
  try {
    // First hire the selected applicant
    await api.patch(`/application-status/${id}/hire`);

    // Then reject all other pending applicants
    const otherApplicants = allApplicants.filter(
      (applicant) => applicant.id !== id && applicant.status === "pending"
    );

    const rejectPromises = otherApplicants.map((applicant) =>
      api.patch(`/application-status/${applicant.id}/reject`)
    );

    await Promise.all(rejectPromises);

    toast.success("Applicant hired and others rejected!");
    console.log("Hired applicant:", id);

    // ✅ Open freelancer contact link after successful hire
    if (selectedApplicant.freelancer_contact) {
      const contact = selectedApplicant.freelancer_contact;

      if (contact.includes("@")) {
        // Likely an email
        window.location.href = `mailto:${contact}`;
      } else if (contact.startsWith("http")) {
        // LinkedIn or portfolio link
        window.open(contact, "_blank");
      } else if (/^\+?\d+$/.test(contact)) {
        // Phone number / WhatsApp
        window.open(`https://wa.me/${contact.replace(/\D/g, "")}`, "_blank");
      }
    }

    // Call onSuccess to update the parent component
    if (onSuccess) {
      onSuccess();
    } else {
      onClose();
    }
  } catch (error) {
    toast.error("Hmmmm that didn't work 🤔");
    console.error(
      "Error hiring applicant:",
      error.response?.data || error.message
    );
  }
    };

    
    return (
        <div className="fixed inset-0 text-secondary bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-base-100 p-6 rounded-lg w-[90%] max-w-md space-y-4">
                <h2 className="text-xl font-semibold">Hire Applicant</h2>
                <p>Are you sure you want to hire this applicant?</p>
                <div className="bg-base-200 p-3 rounded-lg">
                    <p className="font-medium text-lg">{selectedApplicant.user?.first_name} {selectedApplicant.user?.last_name}</p>
                    <p className="text-sm text-base-content/70">
                        {selectedApplicant.user?.email}
                    </p>
                </div>
                <p className="text-sm text-warning">
                    ⚠️ This action cannot be undone. This applicant will be hired and all other pending applicants will be automatically rejected.
                </p>
                
                <div className="flex justify-end gap-3 pt-2">
                    <button className="btn btn-ghost" onClick={onClose}>
                        Cancel
                    </button>
                    <button 
                        className="btn btn-primary" 
                        onClick={() => confirmHire(selectedApplicant.id)}>
                        Confirm hire
                    </button>
                </div>
            </div>
        </div>
    )
}

export default HireApplicantModal