import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { View } from "lucide-react";
import ViewProjectModal from "./ViewProjectModal";
import {
  containerVariants,
  itemVariants,
  buttonVariants,
  tabVariants,
  modalVariants,
  overlayVariants,
  badgeVariants,
  projectCardVariants,
} from "../../ui/animations"; // same animation file you used in UserSkillsAndProjects
import EmptyState from "../../EmptyState";

const SkillsAndProjects = ({ skills }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectList, setProjectList] = useState(skills);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sync state with parent
  useEffect(() => {
    setProjectList(skills);
  }, [skills]);

  if (!Array.isArray(skills)) {
    return (
      <motion.p
        className="text-center text-sm sm:text-base p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        No skills available
      </motion.p>
    );
  }

  if (skills.length === 0) {
    return (
      <motion.div
        className="text-center p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.p
          className="text-base-content/70 text-sm sm:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <EmptyState message="No skills created yet. Create your first skill to get started!" />
        </motion.p>
      </motion.div>
    );
  }

  // Mobile accordion layout
  if (isMobile) {
    return (
      <>
        <motion.div
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {projectList.map((skill, index) => (
            <motion.div
              key={index}
              className="collapse collapse-arrow bg-base-100 border border-base-300"
              variants={itemVariants}
            >
              <input
                type="radio"
                name="mobile-skills-accordion"
                checked={activeIndex === index}
                onChange={() => setActiveIndex(index)}
              />
              <div className="collapse-title text-lg font-medium px-4 py-3">
                <div className="flex items-center">
                  <span className="truncate pr-4">{skill.skill_name}</span>
                  <motion.span
                    className="badge badge-md"
                    variants={badgeVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {skill.projects?.length || 0}
                  </motion.span>
                </div>
              </div>
              <div className="collapse-content px-4 pb-4">
                <p className="text-sm text-base-content/80 mb-4 leading-relaxed">
                  {skill.description}
                </p>
                <div className="space-y-3">
                  {skill.projects?.length > 0 ? (
                    skill.projects.map((project, i) => (
                      <motion.div
                        key={i}
                        className="p-3 bg-base-200 rounded-lg shadow-sm border"
                        variants={projectCardVariants}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold line-clamp-2">
                            {project.title}
                          </h3>
                          <p className="text-xs text-base-content/70 line-clamp-3">
                            {project.description}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <motion.button
                            onClick={() => setSelectedProject(project)}
                            className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            variants={buttonVariants}
                            whileHover={{ y: -2 }}
                            whileTap={{ y: 0 }}
                          >
                            <View className="size-3" /> View
                          </motion.button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-xs text-base-content/50 italic text-center py-4">
                      No projects available for this skill.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Modal */}
        <AnimatePresence>
          {selectedProject && (
            <ViewProjectModal
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop tab layout
  return (
    <>
      <motion.div
        className="w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Tab Headers */}
        <motion.div
          className="flex overflow-x-auto border-b border-base-300 mb-6"
          variants={itemVariants}
        >
          <div className="flex min-w-max">
            {projectList.map((skill, index) => (
              <motion.button
                key={index}
                className="px-4 py-3 text-xl font-medium whitespace-nowrap border-b-2 transition-colors"
                variants={tabVariants}
                animate={activeIndex === index ? "active" : "inactive"}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                onClick={() => setActiveIndex(index)}
              >
                <motion.span
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {skill.skill_name}
                  <motion.span
                    className="badge badge-lg"
                    variants={badgeVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {skill.projects?.length || 0}
                  </motion.span>
                </motion.span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            className="bg-base-100 rounded-lg p-4 sm:p-6 border border-base-300"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {projectList[activeIndex] && (
              <>
                <div className="mb-6">
                  <h2 className="text-3xl font-semibold mb-2">
                    {projectList[activeIndex].skill_name}
                  </h2>
                  <p className="text-lg text-base-content/80 leading-relaxed">
                    {projectList[activeIndex].description}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-medium">Projects</h3>
                  {projectList[activeIndex].projects?.length > 0 ? (
                    <motion.div
                      className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {projectList[activeIndex].projects.map((project, i) => (
                        <motion.div
                          key={i}
                          className="p-4 bg-base-200 rounded-lg shadow-sm border border-base-300 hover:shadow-md transition-shadow"
                          variants={projectCardVariants}
                        >
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-xl font-semibold line-clamp-2">
                                {project.title}
                              </h4>
                              <p className="text-lg text-base-content/70 mt-1 line-clamp-3">
                                {project.description}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                              <motion.button
                                onClick={() => setSelectedProject(project)}
                                className="flex items-center gap-2 px-4 py-2 text-base bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                variants={buttonVariants}
                              >
                                <View className="size-4" /> View
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-base-content/50 italic">
                        No projects available for this skill yet.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Desktop Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              className="bg-base-200 p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <ViewProjectModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SkillsAndProjects;
