import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CircleX } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../lib/axios";
import { modalVariants, overlayVariants, containerVariants } from "../../ui/animations";

import StepOneBasic from "../freelancer/update_project/StepOneBasic";
import StepTwoDetails from "../freelancer/update_project/StepTwoDetails";
import StepThreeMedia from "../freelancer/update_project/StepThreeMedia";

const UpdateProjectForm = ({ project, onClose, onUpdated }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    title: project.title || "",
    description: project.description || "",
    price_range: project.price_range || "",
    media_url: project.media_url || "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) titleRef.current.focus();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 0) {
      if (!formData.title.trim()) newErrors.title = "Title is required.";
      if (formData.description.length > 1000)
        newErrors.description = "Description cannot exceed 1000 characters.";
    }
    if (step === 1) {
      if (!formData.price_range.trim())
        newErrors.price_range = "Price range is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.put(`/projects/${project.id}`, formData);
      toast.success("Project updated successfully!");
      onUpdated({ ...project, ...formData });
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((prev) => prev + 1);
  };

  const steps = [
    <StepOneBasic
      formData={formData}
      handleChange={handleChange}
      titleRef={titleRef}
      errors={errors}
    />,
    <StepTwoDetails
      formData={formData}
      handleChange={handleChange}
      errors={errors}
    />,
    <StepThreeMedia formData={formData} setFormData={setFormData} />,
  ];

  return (
    <dialog id="update_project_modal" className="modal modal-open">
      {/* Modal content */}
      <motion.div
        className="modal-box relative px-10 py-12"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full transition p-1"
        >
          <CircleX className="size-9 text-white hover:text-red-400" />
        </button>

        <h3 className="font-bold text-2xl mb-8">Update Project</h3>

        {/* Steps */}
        <motion.div
          className="mt-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Navigation */}
        <div className="modal-action flex justify-between mt-10">
          {step > 0 ? (
            <button
              className="px-8 py-4 text-white font-medium rounded-lg bg-primary hover:bg-black hover:transform-[scale(1.05)] hover:text-white transition-colors duration-200 focus:outline-none focus:transform-[scale(0.95)] focus:ring-offset-2"
              onClick={() => setStep((prev) => prev - 1)}
              disabled={isSubmitting}
            >
              Back
            </button>
          ) : ( <span />
          )}
          {step < steps.length - 1 ? (
            <button
              className="px-8 py-4 text-blue-600 font-medium rounded-lg bg-primary hover:bg-black hover:transform-[scale(1.05)] hover:text-white transition-colors duration-200 focus:outline-none focus:transform-[scale(0.95)] focus:ring-offset-2"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              Next
            </button>
          ) : (
            <button
              className={`px-8 py-4 text-white font-medium rounded-lg bg-primary hover:bg-black hover:transform-[scale(1.05)] hover:text-white transition-colors duration-200 focus:outline-none focus:transform-[scale(0.95)] focus:ring-offset-2 disabled:opacity-50`}
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.title.trim()}
            >
              {isSubmitting ? "Updating..." : "Finish"}
            </button>
          )}
        </div>
      </motion.div>

      {/* Backdrop */}
      <motion.div
        className="modal-backdrop"    
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      />
    </dialog>
  );
};

export default UpdateProjectForm;
