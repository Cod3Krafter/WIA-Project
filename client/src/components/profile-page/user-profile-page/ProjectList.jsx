import { motion } from "framer-motion";
import ProjectCard from "../user-profile-page/ProjectCard";

const ProjectList = ({ 
  projects, 
  itemVariants, 
  containerVariants, 
  projectCardVariants, 
  buttonVariants, 
  setSelectedProject, 
  setProjectToUpdate, 
  onDeleteProject 
}) => {
  return (
    <motion.div 
      className="space-y-4"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h3 
        className="text-2xl font-medium"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        Projects
      </motion.h3>

      {projects && projects.length > 0 ? (
        <motion.div 
          className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {projects.map((project, i) => (
            <ProjectCard
              key={i}
              project={project}
              projectCardVariants={projectCardVariants}
              buttonVariants={buttonVariants}
              setSelectedProject={setSelectedProject}
              setProjectToUpdate={setProjectToUpdate}
              onDeleteProject={onDeleteProject}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-sm text-base-content/50 italic">
            No projects available for this skill yet.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProjectList;
