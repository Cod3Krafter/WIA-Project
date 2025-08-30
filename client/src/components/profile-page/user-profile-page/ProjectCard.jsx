import { motion } from "framer-motion";
import { View, Trash2, ListRestart, DollarSign, Briefcase } from "lucide-react";

const ProjectCard = ({ 
  project, 
  projectCardVariants, 
  buttonVariants, 
  setSelectedProject, 
  setProjectToUpdate, 
  onDeleteProject 
}) => {
  return (
    <motion.div
      className="p-3 sm:p-4 lg:p-6 bg-base-200 rounded-lg shadow-sm border border-base-300 hover:shadow-md transition-shadow flex flex-col h-auto min-h-[200px] sm:min-h-[240px] lg:min-h-[280px] w-full"
      variants={projectCardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      layout
    >
      <motion.div
        className="flex flex-col justify-between h-full space-y-3 sm:space-y-4 lg:space-y-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Header Section - Title */}
        <div className="flex-1 flex flex-col space-y-2 sm:space-y-3">
          <motion.h3
            className="font-semibold text-base sm:text-lg lg:text-xl xl:text-2xl text-base-content flex items-start gap-2 leading-tight"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Briefcase className="size-4 sm:size-5 lg:size-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2 break-words">{project.title}</span>
          </motion.h3>

          {/* Description */}
          <motion.p
            className="text-xs sm:text-sm lg:text-base text-base-content/70 line-clamp-2 sm:line-clamp-3 break-words flex-1"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {project.description}
          </motion.p>

          {/* Budget */}
          <motion.div
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm lg:text-base text-base-content/80 bg-green-50 dark:bg-green-900/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md w-fit"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <DollarSign className="size-3 sm:size-4 lg:size-5 text-green-600 dark:text-green-400" />
            <span className="font-medium text-green-700 dark:text-green-300">
              Budget: ${project.price_range}
            </span>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-2 sm:gap-2 lg:gap-3 pt-2 sm:pt-3 border-t border-base-300/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Mobile: Stack buttons vertically */}
          {/* Desktop: Show buttons horizontally */}
          <motion.button
            onClick={() => setSelectedProject(project)}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 text-xs sm:text-sm lg:text-base font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex-1 sm:flex-initial min-w-0"
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            <View className="size-3 sm:size-4 lg:size-5 flex-shrink-0" />
            <span className="truncate">View</span>
          </motion.button>

          <motion.button
            onClick={() => setProjectToUpdate(project)}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 text-xs sm:text-sm lg:text-base font-medium bg-green-500 text-white rounded-md hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 flex-1 sm:flex-initial min-w-0"
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            <ListRestart className="size-3 sm:size-4 lg:size-5 flex-shrink-0" />
            <span className="truncate">Update</span>
          </motion.button>

          <motion.button
            onClick={() => onDeleteProject(project)}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 text-xs sm:text-sm lg:text-base font-medium bg-red-500 text-white rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 flex-1 sm:flex-initial min-w-0"
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            <Trash2 className="size-3 sm:size-4 lg:size-5 flex-shrink-0" />
            <span className="truncate">Delete</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectCard;