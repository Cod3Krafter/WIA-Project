import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { CircleX } from "lucide-react";
import { createSkillSchema } from "../../../lib/validation/CreateSkillSchema";

const CreateSkillForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    skill_name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const skillNameRef = useRef(null);

  useEffect(() => {
    if (skillNameRef.current) {
      skillNameRef.current.focus();
    }
  }, []);

  const validateForm = async () => {
    try {
      await createSkillSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      if (err.inner) {
        const newErrors = {};
        err.inner.forEach((e) => {
          newErrors[e.path] = e.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      await onSubmit({
        skill_name: formData.skill_name.trim(),
        description: formData.description.trim(),
      });
      setFormData({ skill_name: "", description: "" });
      setErrors({});
    } catch (error) {
      console.error("Error creating skill:", error);
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

  return (
    <dialog id="create_skill_modal" className="modal modal-open">
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
        >
          <CircleX className="size-9 text-white hover:text-red-400" />
        </button>

        <h3 className="font-bold text-2xl mt-6">Create New Skill</h3>

        <div className="space-y-5 mt-6">
          {/* Skill Name Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg mb-2 font-medium">
                Skill Name <span className="text-error">*</span>
              </span>
            </label>
            <input
              ref={skillNameRef}
              type="text"
              placeholder="e.g., JavaScript, Project Management ...."
              className={`input input-bordered p-3 w-full h-13 text-lg ${
                errors.skill_name ? 'input-error' : ''
              }`}
              value={formData.skill_name}
              onChange={(e) => {
                setFormData({ ...formData, skill_name: e.target.value });
                if (errors.skill_name) {
                  setErrors({ ...errors, skill_name: null });
                }
              }}
              maxLength={100}
            />
            {errors.skill_name && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.skill_name}</span>
              </label>
            )}
          </div>

          {/* Description Field */}
          <div className="form-control">
            <label className="label flex items-center justify-between mb-2">
              <span className="label-text text-lg font-medium">
                Description
              </span>
              <span className="label-text-alt text-sm text-base-content/60">
                {formData.description.length}/500
              </span>
            </label>

            <textarea
              className={`textarea textarea-bordered w-full h-50 resize-none text-lg ${
                errors.description ? 'textarea-error' : ''
              }`}
              placeholder="Describe your skill level, experience, or any relevant details..."
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) {
                  setErrors({ ...errors, description: null });
                }
              }}
              maxLength={500}
            />
            {errors.description && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.description}</span>
              </label>
            )}
          </div>
        </div>

        <div className="modal-action flex-col sm:flex-row justify-end gap-4 pt-4">
          <button 
            className="px-8 py-4 text-white font-medium rounded-lg bg-primary hover:bg-black hover:transform-[scale(1.05)] hover:text-white transition-colors duration-200 focus:outline-none focus:transform-[scale(0.95)] focus:ring-offset-2" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className={`px-8 py-4 text-blue-600 font-medium rounded-lg bg-primary hover:bg-black hover:transform-[scale(1.05)] hover:text-white transition-colors duration-200 focus:outline-none focus:transform-[scale(0.95)] focus:ring-offset-2 ${isSubmitting ? 'loading' : ''}`}
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.skill_name.trim()}
          >
            {isSubmitting ? 'Creating...' : 'Create skill'}
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
};

export default CreateSkillForm;
