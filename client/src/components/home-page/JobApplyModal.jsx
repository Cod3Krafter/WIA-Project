import { useEffect, useState } from "react";
import { Formik } from "formik";
import toast from "react-hot-toast";
import { CircleX, Briefcase, DollarSign, Calendar, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../lib/axios";
import { jobApplicationSchema } from "../../lib/validation/JobApplicationSchema.jsx";
import { useAuth } from "../../context/useAuth.jsx";
import { modalVariants, containerVariants, itemVariants } from "../ui/animations.jsx";

const handleCancel = (resetForm) => {
  document.getElementById("apply-modal")?.close();
  resetForm?.();
};

const JobApplyModal = ({ selectedJob, handleDeleteSavedJob }) => {
  const {user} = useAuth()
  const userId = user?.id
  const [contacts, setContacts] = useState([]);
  console.log( userId);

  // 🔹 Fetch contact methods once modal opens
   useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await api.get(`/contact/${userId}`);
        setContacts(res.data); // use response data directly
        console.log("Freelancer contacts", res.data);
      } catch (err) {
        console.error("Error fetching contact methods:", err);
        toast.error("Could not load your contact methods");
      }
    };

    if (userId) {
      fetchContacts();
    }
  }, [userId]);

  return (
    <AnimatePresence>
      <dialog id="apply-modal" className="modal">
        <motion.div
          className="modal-box max-w-full bg-base-100 w-full h-[90vh] rounded-2xl shadow-2xl relative flex flex-col overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {selectedJob && (
            <>
              {/* Close Button */}
              <motion.button
                onClick={() => handleCancel(selectedJob.id)}
                className="absolute top-4 right-4 rounded-full transition p-1 z-10"
                variants={itemVariants}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <CircleX className="size-9 text-blue-500 hover:text-red-400" />
              </motion.button>

              <motion.div
                className="flex flex-col lg:flex-row h-full"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* 🧾 Job Details */}
                <motion.div
                  className="w-full lg:w-1/2 flex flex-col overflow-hidden bg-gradient-to-br mt-10 from-base-200 to-base-300"
                  variants={itemVariants}
                >
                  <motion.div
                    className="flex-1 p-6 sm:p-8 overflow-y-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {/* Job Header */}
                    <motion.div className="mb-6 " variants={itemVariants}>
                      <motion.div
                        className="flex items-center gap-3 mb-4"
                        variants={itemVariants}
                      >
                        <div className="p-2 bg-blue-500 rounded-lg">
                          <Briefcase className="size-6 text-white" />
                        </div>
                        <span className="text-2xl text-gray-400 uppercase tracking-wider font-bold">
                          Job Opportunity
                        </span>
                      </motion.div>
                      
                      <motion.h3
                        className="text-2xl sm:text-3xl font-bold mb-4 text-white"
                        variants={itemVariants}
                      >
                        {selectedJob.title}
                      </motion.h3>

                      {/* Divider */}
                      <motion.div
                        className="w-12 h-1 bg-blue-500 rounded-full mb-6"
                        variants={itemVariants}
                      />
                    </motion.div>

                    {/* Job Info Cards */}
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
                      variants={containerVariants}
                    >
                      <motion.div
                        className="bg-base-100/50 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-3">
                          <DollarSign className="size-5 text-green-400" />
                          <div>
                            <p className="text-sm text-gray-400">Budget</p>
                            <p className="text-xl font-bold text-white">
                              ${selectedJob.budget}
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="bg-base-100/50 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="size-5 text-red-400" />
                          <div>
                            <p className="text-sm text-gray-400">Deadline</p>
                            <p className="text-lg font-semibold text-white">
                              {selectedJob.deadline}
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="bg-base-100/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 sm:col-span-2"
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-3">
                          <Tag className="size-5 text-purple-400" />
                          <div>
                            <p className="text-sm text-gray-400">Category</p>
                            <p className="text-lg font-semibold text-white">
                              {selectedJob.category}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Description */}
                    <motion.div className="mb-6" variants={itemVariants}>
                      <h3 className="text-xl font-semibold mb-3 text-gray-200">
                        Job Description
                      </h3>
                      <motion.div
                        className="bg-base-100/30 backdrop-blur-sm rounded-xl p-5 border border-white/10"
                        whileHover={{ scale: 1.01 }}
                      >
                        <p className="text-white leading-relaxed">
                          {selectedJob.description}
                        </p>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* ✍️ Application Form */}
                <motion.div
                  className="w-full lg:w-1/2 flex flex-col overflow-hidden bg-base-100"
                  variants={itemVariants}
                >
                  <Formik
                    initialValues={{
                      proposal: "",
                      expected_budget: "",
                      freelancer_contact: "",
                    }}
                    validationSchema={jobApplicationSchema}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                      try {
                        await api.post("/job-applications", {
                          job_id: selectedJob.id,
                          ...values,
                          expected_budget: Number(values.expected_budget),
                        });
                        document.getElementById("apply-modal")?.close();
                        toast.success("Job application submitted");
                        resetForm();
                      } catch (err) {
                        if (err.response?.status === 409) {
                          document.getElementById("apply-modal")?.close();
                          toast.error("You have already applied for this job.");
                          resetForm();
                        } else {
                          console.error("Error applying to job:", err);
                          toast.error("Something went wrong");
                        }
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleSubmit,
                      isSubmitting,
                      resetForm,
                    }) => (
                      <motion.form
                        onSubmit={handleSubmit}
                        className="flex-1 p-6 sm:p-8 overflow-y-auto"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {/* Form Header */}
                        <motion.div className="mb-8" variants={itemVariants}>
                          <h3 className="text-2xl font-bold mb-2 text-white">
                            Submit Your Application
                          </h3>
                          <motion.div
                            className="w-12 h-1 bg-blue-500 rounded-full"
                            variants={itemVariants}
                          />
                        </motion.div>

                        {/* Proposal Field */}
                        <motion.div className="mb-6" variants={itemVariants}>
                          <label className="block text-lg font-semibold mb-3 text-white">
                            Your Proposal
                          </label>
                          <motion.textarea
                            name="proposal"
                            className="textarea textarea-bordered w-full min-h-[200px] text-base bg-base-200/50 backdrop-blur-sm border-white/20 focus:border-blue-400 transition-colors resize-none"
                            placeholder="Describe why you're the perfect fit for this project..."
                            value={values.proposal}
                            onChange={handleChange}
                            whileFocus={{ scale: 1.01 }}
                          />
                          {touched.proposal && errors.proposal && (
                            <motion.p
                              className="text-red-400 text-sm mt-2"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              {errors.proposal}
                            </motion.p>
                          )}
                        </motion.div>

                        {/* Budget Field */}
                        <motion.div className="mb-6" variants={itemVariants}>
                          <label className="block text-lg font-semibold mb-3 text-white">
                            Your Proposed Budget
                          </label>
                          <motion.input
                            type="number"
                            name="expected_budget"
                            className="input input-bordered w-full h-13 text-base bg-base-200/50 backdrop-blur-sm border-white/20 focus:border-blue-400 transition-colors"
                            placeholder="Enter your budget in USD"
                            value={values.expected_budget}
                            onChange={handleChange}
                            whileFocus={{ scale: 1.01 }}
                          />
                          {touched.expected_budget && errors.expected_budget && (
                            <motion.p
                              className="text-red-400 text-sm mt-2"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              {errors.expected_budget}
                            </motion.p>
                          )}
                        </motion.div>

                         {/* Contact Field */}
                        <motion.div className="mb-8" variants={itemVariants}>
                          <label className="block text-lg font-semibold mb-3 text-white">
                            Contact Information
                          </label>
                          <motion.div className="relative">
                            <motion.select
                              name="freelancer_contact"
                              className="select w-full h-14 text-base bg-base-200/50 backdrop-blur-sm border-2 border-white/20 focus:border-blue-400 hover:border-white/30 transition-all duration-200 rounded-xl appearance-none cursor-pointer pr-12 text-white placeholder:text-gray-400"
                              value={values.freelancer_contact}
                              onChange={handleChange}
                              whileFocus={{ scale: 1.01 }}
                              whileHover={{ borderColor: "rgba(255, 255, 255, 0.3)" }}
                            >
                              <option value="" className="bg-base-300 text-gray-400">
                                Select your preferred contact method
                              </option>
                              {contacts.map((c, idx) => (
                                <option key={idx} value={c.value} className="bg-base-300 text-white py-2">
                                  {c.type}: {c.value}
                                </option>
                              ))}
                            </motion.select>
                            {/* Custom Dropdown Arrow */}
                            <motion.div 
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
                              animate={{ rotate: values.freelancer_contact ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <svg 
                                className="w-5 h-5 text-blue-400" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M19 9l-7 7-7-7" 
                                />
                              </svg>
                            </motion.div>
                            {/* Focus Ring */}
                            <motion.div 
                              className="absolute inset-0 rounded-xl pointer-events-none"
                              initial={{ boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)" }}
                              whileFocus={{ boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
                            />
                          </motion.div>
                          {touched.freelancer_contact && errors.freelancer_contact && (
                            <motion.p
                              className="text-red-400 text-sm mt-2 flex items-center gap-2"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              {errors.freelancer_contact}
                            </motion.p>
                          )}
                        </motion.div>
                        {/* Action Buttons */}
                        <motion.div 
                          className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-white/10"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <motion.button
                            type="button"
                            className="px-8 py-4 text-blue-600 font-medium rounded-lg bg-primary hover:bg-black hover:transform-[scale(1.05)] hover:text-white transition-colors duration-200 focus:outline-none focus:transform-[scale(0.95)] focus:ring-offset-2"
                            onClick={() => handleCancel(resetForm)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Cancel
                          </motion.button>
                          <motion.button
                            type="submit"
                            className="px-8 py-4 text-green-600 font-medium rounded-lg bg-primary hover:bg-black hover:transform-[scale(1.05)] hover:text-white transition-colors duration-200 focus:outline-none focus:transform-[scale(0.95)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleDeleteSavedJob}
                            disabled={isSubmitting}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {isSubmitting ? (
                              <div className="flex items-center gap-2">
                                <div className="loading loading-spinner loading-sm"></div>
                                Submitting...
                              </div>
                            ) : (
                              "Submit Application"
                            )}
                          </motion.button>
                        </motion.div>
                      </motion.form>
                    )}
                  </Formik>
                </motion.div>
              </motion.div>
            </>
          )}
        </motion.div>
      </dialog>
    </AnimatePresence>
  );
};

export default JobApplyModal;