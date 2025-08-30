import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { CircleX } from "lucide-react";

export default function EditPostedJobModal({ job, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: job?.title || "",
    description: job?.description || "",
    budget: job?.budget || "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Job title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Job description is required";
    }
    if (!formData.budget.trim()) {
      newErrors.budget = "Budget is required";
    } else if (isNaN(Number(formData.budget)) || Number(formData.budget) <= 0) {
      newErrors.budget = "Budget must be a valid positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      await onSave({ 
        ...job, 
        title: formData.title.trim(), 
        description: formData.description.trim(), 
        budget: formData.budget.trim() 
      });
    } catch (error) {
      console.error("Error updating job:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!job) return null;

  return (
    <dialog id="edit_job_modal" className="modal modal-open">
      <motion.div 
        className="modal-box relative px-13 py-16"
        onKeyDown={handleKeyDown}
        initial={{ opacity: 0, scale: 0.9, y: -30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full transition p-1"
          disabled={isSubmitting}
        >
          <CircleX className="size-9 text-white hover:text-red-400" />
        </button>

        <h3 className="font-bold text-2xl mt-6">Edit Job</h3>

        <div className="space-y-5 mt-6">
          {/* Job Title Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg mb-2 font-medium">
                Job Title <span className="text-error">*</span>
              </span>
            </label>
            <input
              ref={titleRef}
              type="text"
              placeholder="e.g., Frontend Developer, Marketing Manager..."
              className={`input input-bordered p-3 w-full h-13 text-lg ${
                errors.title ? 'input-error' : ''
              }`}
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) {
                  setErrors({ ...errors, title: null });
                }
              }}
              maxLength={100}
              disabled={isSubmitting}
            />
            {errors.title && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.title}</span>
              </label>
            )}
          </div>

          {/* Job Description Field */}
          <div className="form-control">
            <label className="label flex items-center justify-between mb-2">
              <span className="label-text text-lg font-medium">
                Job Description <span className="text-error">*</span>
              </span>
              <span className="label-text-alt text-sm text-base-content/60">
                {formData.description.length}/1000
              </span>
            </label>

            <textarea
              className={`textarea textarea-bordered w-full h-50 resize-none text-lg ${
                errors.description ? 'textarea-error' : ''
              }`}
              placeholder="Describe the job requirements, responsibilities, and qualifications..."
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) {
                  setErrors({ ...errors, description: null });
                }
              }}
              maxLength={1000}
              disabled={isSubmitting}
            />
            {errors.description && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.description}</span>
              </label>
            )}
          </div>

          {/* Budget Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg mb-2 font-medium">
                Budget <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="number"
              placeholder="e.g., 5000"
              className={`input input-bordered p-3 w-full h-13 text-lg ${
                errors.budget ? 'input-error' : ''
              }`}
              value={formData.budget}
              onChange={(e) => {
                setFormData({ ...formData, budget: e.target.value });
                if (errors.budget) {
                  setErrors({ ...errors, budget: null });
                }
              }}
              min="0"
              step="0.01"
              disabled={isSubmitting}
            />
            {errors.budget && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.budget}</span>
              </label>
            )}
          </div>
        </div>

        <div className="modal-action flex-col sm:flex-row justify-end gap-4 pt-4">
          <button 
            type="button"
            className="px-8 py-4 text-white font-medium rounded-lg bg-primary hover:bg-black hover:transform-[scale(1.05)] hover:text-white transition-colors duration-200 focus:outline-none focus:transform-[scale(0.95)] focus:ring-offset-2" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`px-8 py-4 text-blue-600 font-medium rounded-lg bg-primary hover:bg-black hover:transform-[scale(1.05)] hover:text-white transition-colors duration-200 focus:outline-none focus:transform-[scale(0.95)] focus:ring-offset-2 ${isSubmitting ? 'loading' : ''}`}
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.title.trim() || !formData.description.trim() || !formData.budget.trim()}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
      
      {/* Backdrop click handler */}
      <motion.div 
        className="modal-backdrop" 
        onClick={handleBackdropClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
    </dialog>
  );
}