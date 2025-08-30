import React from "react";
import { CircleX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { overlayVariants, modalVariants, containerVariants, itemVariants } from "../../ui/animations.jsx";

const ViewProjectModal = ({ project, onClose }) => {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="bg-base-100 w-full max-w-8xl h-[90vh] rounded-2xl shadow-2xl relative flex flex-col overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Close Button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full transition p-1"
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
              {/* Image Section */}
              <motion.div
                className="w-full lg:w-1/2 h-64 lg:h-full bg-gray-100"
                variants={itemVariants}
              >
                {project.media_url ? (
                  <motion.img
                    src={project.media_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                ) : (
                  <motion.div
                    className="w-full h-full flex items-center justify-center text-gray-400"
                    variants={itemVariants}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm">No image available</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Content Section */}
              <motion.div
                className="w-full lg:w-1/2 flex flex-col overflow-hidden"
                variants={itemVariants}
              >
                <motion.div
                  className="flex-1 p-6 mt-8 sm:p-8 overflow-y-auto"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Title */}
                  <motion.h2
                    className="text-2xl sm:text-3xl font-bold mb-2 text-white"
                    variants={itemVariants}
                  >
                    {project.title}
                  </motion.h2>

                  {/* Divider */}
                  <motion.div
                    className="w-12 h-1 bg-blue-500 rounded-full mb-6"
                    variants={itemVariants}
                  />

                  {/* Description */}
                  <motion.div className="mb-8" variants={itemVariants}>
                    <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-200">
                      About This Project
                    </h3>
                    <p className="text-white text-xl leading-relaxed">
                      {project.description || "No description available."}
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ViewProjectModal;
