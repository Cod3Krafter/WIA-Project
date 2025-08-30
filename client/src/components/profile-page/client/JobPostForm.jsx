import React, { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, DollarSign, Calendar, Tag, FileText, Send, Award } from "lucide-react";
import api from "../../../lib/axios";
import { toast } from "react-hot-toast";
import { formVariants, fieldVariants, buttonVariants } from "../../ui/animations";

const JobPostForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    category: "",
    deadline: "",
  });
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setErrors([]);
    setIsSubmitting(true);

    try {
      const res = await api.post("/jobs/job", formData);
      toast.success("Job posted successfully!");
      setStatus("Job posted successfully!");
      setFormData({
        title: "",
        description: "",
        budget: "",
        category: "",
        deadline: "",
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      if (err.response) {
        const { data } = err.response;
        if (data.errors) setErrors(data.errors);
        else setErrors([data.message || "Something went wrong"]);
      } else {
        setErrors(["Network error or server issue"]);
      }
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="min-w-[700px] flex flex-col gap-8 px-10 py-20 bg-base-200 rounded-lg shadow-sm border border-base-300"
      initial="hidden"
      animate="visible"
      variants={formVariants}
    >
      <motion.div
        className="mb-2"
        variants={fieldVariants}
      >
        <h2 className="text-3xl font-semibold text-base-content flex items-center gap-4">
          <Briefcase className="size-6 text-blue-600" />
          Post a New Job
        </h2>
        <p className="text-lg mt-3">Fill in the details below to create your job listing</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Title Field */}
        <motion.div variants={fieldVariants}>
          <label className="font-medium text-xl mb-2 flex items-center gap-2">
            <Award className="size-7 text-red-500" />
            Job Title
          </label>
          <motion.input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input input-bordered w-full h-13 text-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            placeholder="e.g., Full Stack Developer"
            required
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>

        {/* Description Field */}
        <motion.div variants={fieldVariants}>
          <label className="font-medium text-xl mb-2 flex items-center gap-2">
            <FileText className="size-5 text-purple-600" />
            Description
          </label>
          <motion.textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="textarea textarea-bordered w-full h-32 p-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
            placeholder="Describe the job requirements, responsibilities, and qualifications..."
            required
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>

        {/* Budget and Category Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={fieldVariants}
        >
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="font-medium text-xl mb-2 flex items-center gap-2">
              <DollarSign className="size-5 text-green-500" />
              Budget ($)
            </label>
            <motion.input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="input input-bordered w-full h-13 text-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="font-medium text-xl mb-2 flex items-center gap-2">
              <Tag className="size-5 text-blue-500" />
              Category
            </label>
            <motion.input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input input-bordered w-full h-13 text-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="e.g., Web Development"
              required
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
        </motion.div>

        {/* Deadline Field */}
        <motion.div variants={fieldVariants}>
          <label className="font-medium text-xl mb-2 flex items-center align-middle gap-2">
            <Calendar className="size-? text-orange-500" />
            <p className="text-base-content">Deadline</p>
          </label>
          <motion.input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="input input-bordered w-1/2 h-13 text-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            required
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={fieldVariants} className="mt-10">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="flex px-10 py-4 text-blue-600 font-medium rounded-lg bg-primary hover:bg-black hover:text-white transition-colors duration-200 focus:outline-none focus:ring-offset-2 items-center justify-center gap-2"
            variants={buttonVariants}
            initial="rest"
            whileHover={!isSubmitting ? "hover" : "rest"}
            whileTap={!isSubmitting ? "tap" : "rest"}
          >
            <Send className="size-5" />
            {isSubmitting ? "Posting Job..." : "Post Job"}
          </motion.button>
        </motion.div>

        {/* Status Message */}
        {status && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-success/10 border border-success/20 rounded-lg"
          >
            <p className="text-success font-medium">{status}</p>
          </motion.div>
        )}

        {/* Error Messages */}
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-error/10 border border-error/20 rounded-lg"
          >
            <ul className="space-y-1">
              {errors.map((err, idx) => (
                <motion.li
                  key={idx}
                  className="text-error flex items-start gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <span className="w-1.5 h-1.5 bg-error rounded-full mt-2 flex-shrink-0" />
                  {err}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};

export default JobPostForm;