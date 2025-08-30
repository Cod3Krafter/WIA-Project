import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { CircleX } from "lucide-react";
import api from "../../../lib/axios.js";

// Steps
import StepOneBasic from "./create_project/StepOneBasic.jsx";
import StepTwoDescriptionMedia from "./create_project/StepTwoDescriptionMedia.jsx";
import StepThreePrice from "./create_project/StepThreePrice.jsx";

const CreateProjectForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    skill_id: "",
    title: "",
    description: "",
    media_url: "",
    price_range: "",
  });

  const [skills, setSkills] = useState([]);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) titleRef.current.focus();

    const token = localStorage.getItem("accessToken");
    const fetchSkills = async () => {
      try {
        const res = await api.get("/skill/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSkills(res.data);
      } catch (err) {
        console.error("Failed to fetch skills:", err);
      }
    };

    fetchSkills();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      setFormData({
        skill_id: "",
        title: "",
        description: "",
        media_url: "",
        price_range: "",
      });
      setStep(1);
      onClose();
    } catch (err) {
      console.error("Error creating project:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <dialog id="create_project_modal" className="modal modal-open">
      <motion.div
        className="modal-box relative px-10 py-14 max-w-2xl"
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

        <h3 className="font-bold text-2xl mt-6 mb-6">Create New Project</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <StepOneBasic
              formData={formData}
              handleChange={handleChange}
              titleRef={titleRef}
              skills={skills}
            />
          )}
          {step === 2 && (
            <StepTwoDescriptionMedia
              formData={formData}
              handleChange={handleChange}
            />
          )}
          {step === 3 && (
            <StepThreePrice formData={formData} handleChange={handleChange} />
          )}

          {/* Navigation */}
          <div className="modal-action flex-col sm:flex-row justify-between gap-4 pt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-8 py-4 font-medium rounded-lg bg-base-200 hover:bg-base-300 transition"
              >
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-4 font-medium rounded-lg bg-base-200 hover:bg-base-300 transition"
              >
                Cancel
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-4 text-blue-600 font-medium rounded-lg bg-primary hover:bg-black transition"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className={`px-8 py-4 text-blue-600 font-medium rounded-lg bg-primary hover:bg-black transition ${
                  isSubmitting ? "loading" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Project"}
              </button>
            )}
          </div>
        </form>
      </motion.div>

      {/* Backdrop */}
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

export default CreateProjectForm;
