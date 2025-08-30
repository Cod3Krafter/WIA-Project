import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { CircleX } from "lucide-react";
import api from "../../../lib/axios";
import toast from "react-hot-toast";

const UpdateSkillForm = ({ skill, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    skill_name: skill.skill_name || "",
    description: skill.description || "",
  });
  const [loading, setLoading] = useState(false);
  const skillNameRef = useRef(null);

  useEffect(() => {
    if (skillNameRef.current) {
      skillNameRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.put(`/skill/${skill.id}`, formData);
      let updatedSkill;
      if (res.data.skill) {
        updatedSkill = res.data.skill;
      } else if (res.data.id) {
        updatedSkill = res.data;
      } else {
        updatedSkill = {
          ...skill,
          skill_name: formData.skill_name,
          description: formData.description,
        };
      }

      onSubmit(updatedSkill);
    } catch (err) {
      toast.error("Failed to update skill");
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <dialog id="update_skill_modal" className="modal modal-open">
      <motion.div
        className="modal-box relative px-13 py-16"
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

        <h3 className="font-bold text-2xl mt-6">Update Skill</h3>

        <form onSubmit={handleUpdate} className="space-y-6 mt-6">
          {/* Skill Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg mb-2 font-medium">
                Skill Name <span className="text-error">*</span>
              </span>
              <span className="label-text-alt text-sm text-blue-600">
                Current: {skill.skill_name}
              </span>
            </label>
            <input
              ref={skillNameRef}
              type="text"
              name="skill_name"
              value={formData.skill_name}
              onChange={handleChange}
              placeholder="Update skill name..."
              className="input input-bordered p-3 w-full h-13 text-lg"
              required
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg mb-2 font-medium">Description</span>
              <span className="label-text-alt text-base-content/60">
                {formData.description.length}/500
              </span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full h-50 resize-none text-lg"
              placeholder="Update your skill description..."
              maxLength={500}
            />
          </div>

          {/* Buttons */}
          <div className="modal-action flex flex-col sm:flex-row justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-8 py-4 text-white font-medium rounded-lg bg-neutral hover:bg-black hover:scale-105 transition-transform duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 text-blue-600 font-medium rounded-lg bg-primary hover:bg-black hover:text-white hover:scale-105 transition-transform duration-200 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Skill"}
            </button>
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

export default UpdateSkillForm;
