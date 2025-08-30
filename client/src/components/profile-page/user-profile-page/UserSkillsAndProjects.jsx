import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ViewProjectModal from "../freelancer/ViewProjectModal";
import UpdateProjectForm from "../../../components/profile-page/freelancer/UpdateProjectForm";
import { View } from "lucide-react";
import SkillAccordion from "./SkillAccordion";
import SkillDetails from "../user-profile-page/SkilDetails";
import ProjectList from "./ProjectList";
import {containerVariants, itemVariants, buttonVariants, tabVariants, modalVariants, overlayVariants, badgeVariants, projectCardVariants} from "../../ui/animations";

const UserSkillsAndProjects = ({ skills, onDeleteProject }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectToUpdate, setProjectToUpdate] = useState(null);
  const [projectList, setProjectList] = useState(skills);
  const [isMobile, setIsMobile] = useState(false);


  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sync local state with parent's skills prop
  useEffect(() => {
    setProjectList(skills);
  }, [skills]);

  const handleProjectUpdated = (updatedProject) => {
    setProjectList((prev) =>
      prev.map((skill) => ({
        ...skill,
        projects: skill.projects.map((proj) =>
          proj.id === updatedProject.id ? updatedProject : proj
        )
      }))
    );
  };

  if (!Array.isArray(skills) || skills.length === 0) {
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
          No skills created yet. Create your first skill to get started!
        </motion.p>
      </motion.div>
    );
  }

  // Mobile accordion-style layout
  if (isMobile) {
    return (
      <>
        <motion.div 
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <SkillAccordion 
            projectList={projectList}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            setSelectedProject={setSelectedProject}
            setProjectToUpdate={setProjectToUpdate}
            onDeleteProject={onDeleteProject}
          />
        </motion.div>

        {/* Mobile Modals */}
        <AnimatePresence>
          {selectedProject && (
            <ViewProjectModal
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          )}

          {projectToUpdate && (
            <motion.div 
              className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.div 
                className="bg-base-200 rounded-lg max-w-full w-full max-h-[90vh] overflow-y-auto"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <UpdateProjectForm
                  project={projectToUpdate}
                  onClose={() => setProjectToUpdate(null)}
                  onUpdated={handleProjectUpdated}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop tab-style layout
  return (
    <>
      <motion.div 
        className="w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Tab Headers - Scrollable on smaller screens */}
        <motion.div 
          className="flex overflow-x-auto border-b border-base-300 mb-6"
          variants={itemVariants}
        >
          <div className="flex min-w-max">
            {projectList.map((skill, index) => (
              <motion.button
                key={index}
                className={`px-4 py-3 text-xl font-medium whitespace-nowrap border-b-2 transition-colors
                  ${
                    activeIndex === index
                      ? "border-blue-500/70 text-blue-500"
                      : "border-transparent text-base-content/70 hover:text-base-content hover:border-base-content/30"
                  }`}
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
                <SkillDetails 
                  skill={projectList[activeIndex]} 
                  itemVariants={itemVariants} 
                />

                <ProjectList
                  
                  projects={projectList[activeIndex].projects}
                  itemVariants={itemVariants}
                  containerVariants={containerVariants}
                  projectCardVariants={projectCardVariants}
                  buttonVariants={buttonVariants}
                  setSelectedProject={setSelectedProject}
                  setProjectToUpdate={setProjectToUpdate}
                  onDeleteProject={onDeleteProject}
                />
              </>
            )}
          </motion.div>
        </AnimatePresence>

      </motion.div>

      {/* Desktop Modals */}
      <AnimatePresence>
        {selectedProject && (
          <ViewProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}

        {projectToUpdate && (
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
              <UpdateProjectForm
                project={projectToUpdate}
                onClose={() => setProjectToUpdate(null)}
                onUpdated={handleProjectUpdated}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserSkillsAndProjects;