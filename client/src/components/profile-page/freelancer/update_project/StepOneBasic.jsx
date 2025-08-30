import { motion } from "framer-motion";

const StepOneBasic = ({ formData, handleChange, titleRef, errors }) => {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Title */}
      <div className="form-control">
        <label className="label">
          <span className="label-text text-lg mb-2 font-medium">
            Project Title <span className="text-error">*</span>
          </span>
        </label>
        <input
          ref={titleRef}
          type="text"
          name="title"
          className={`input input-bordered h-13 p-3 w-full text-lg ${
            errors?.title ? "input-error" : ""
          }`}
          placeholder="e.g., Mobile App, Website Redesign..."
          value={formData.title}
          onChange={handleChange}
          maxLength={100}
          required
        />
        {errors?.title && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.title}</span>
          </label>
        )}
      </div>

      {/* Description */}
      <div className="form-control">
        <label className="label flex items-center justify-between mb-2">
          <span className="label-text text-lg font-medium">Description</span>
          <span className="label-text-alt text-sm text-base-content/60">
            {formData.description.length}/1000
          </span>
        </label>
        <textarea
          name="description"
          className={`textarea textarea-bordered w-full h-40 resize-none text-lg ${
            errors?.description ? "textarea-error" : ""
          }`}
          placeholder="Briefly describe your project..."
          value={formData.description}
          onChange={handleChange}
          maxLength={1000}
        />
        {errors?.description && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.description}</span>
          </label>
        )}
      </div>
    </motion.div>
  );
};

export default StepOneBasic;
