import { motion, AnimatePresence } from "framer-motion";
import { 
  accordionVariants, 
  badgeVariants, 
  containerVariants, 
  projectCardVariants, 
  buttonVariants 
} from "../../ui/animations"; // adjust the path

import { View } from "lucide-react"; // or wherever your icons are from

const SkillAccordion = ({
  projectList,
  activeIndex,
  setActiveIndex,
  setSelectedProject,
  setProjectToUpdate,
  onDeleteProject
}) => {
  return (
    <>
      {projectList.map((skill, index) => (
        <motion.div 
          key={index} 
          className="collapse collapse-arrow bg-base-100 border border-base-300"
          variants={accordionVariants}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Radio input to control active accordion */}
          <input 
            type="radio" 
            name="mobile-skills-accordion" 
            checked={activeIndex === index}
            onChange={() => setActiveIndex(index)}
          />

          {/* Accordion Header */}
          <div className="collapse-title text-lg font-medium px-4 py-3">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="truncate pr-4">{skill.skill_name}</span>
              <motion.span 
                className="badge badge-md badge-base"
                variants={badgeVariants}
                initial="hidden"
                animate="visible"
              >
                {skill.projects?.length || 0}
              </motion.span>
            </motion.div>
          </div>

          {/* Accordion Body */}
          <AnimatePresence>
            {activeIndex === index && (
              <motion.div 
                className="collapse-content px-4 pb-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <motion.p 
                  className="text-sm text-base-content/80 mb-4 leading-relaxed"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {skill.description}
                </motion.p>

                {/* Project Cards */}
                <motion.div 
                  className="space-y-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {skill.projects && skill.projects.length > 0 ? (
                    skill.projects.map((project, i) => (
                      <motion.div 
                        key={i}
                        className="p-3 bg-base-200 rounded-lg shadow-sm border"
                        variants={projectCardVariants}
                        whileHover="hover"
                      >
                        <motion.div 
                          className="space-y-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h3 className="text-sm font-semibold line-clamp-2">
                            {project.title}
                          </h3>
                          <p className="text-xs text-base-content/70 line-clamp-3">
                            {project.description}
                          </p>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div 
                          className="flex flex-wrap gap-2 mt-3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <motion.button
                            onClick={() => setSelectedProject(project)}
                            className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            variants={buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <View className="size-3" /> View
                          </motion.button>
                          <motion.button
                            onClick={() => setProjectToUpdate(project)}
                            className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                            variants={buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                          >
                            Update
                          </motion.button>
                          <motion.button
                            onClick={() => onDeleteProject(project)}
                            className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            variants={buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                          >
                            Delete
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.p 
                      className="text-xs text-base-content/50 italic text-center py-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      No projects available for this skill.
                    </motion.p>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </>
  );
};

export default SkillAccordion;
