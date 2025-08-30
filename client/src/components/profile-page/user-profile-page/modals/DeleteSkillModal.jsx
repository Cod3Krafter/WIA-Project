import { motion } from "framer-motion";

const DeleteSkillModal = ({ 
  showDeleteModal, 
  skillToDelete, 
  handleCancelDelete, 
  handleDeleteSkill, 
  overlayVariants, 
  modalVariants 
}) => {
  if (!showDeleteModal || !skillToDelete) return null;

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-6"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div 
        className="bg-base-100 p-8 sm:p-10 rounded-2xl w-full max-w-2xl mx-4 space-y-6"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.h2 
          className="text-2xl sm:text-3xl font-bold text-error"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Delete Skill
        </motion.h2>

        <motion.p 
          className="text-lg sm:text-xl"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          Are you sure you want to delete this skill?
        </motion.p>

        <motion.div 
          className="bg-base-200 p-5 rounded-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="font-semibold text-xl sm:text-2xl break-words">
            {skillToDelete.skill_name}
          </p>
          <p className="text-base sm:text-lg text-base-content/70 break-words">
            {skillToDelete.description}
          </p>
        </motion.div>

        <motion.p 
          className="text-base sm:text-lg text-warning"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          ⚠️ This action cannot be undone. All associated projects will also be affected.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row justify-end gap-4 pt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button 
            className="px-8 py-4 text-blue-600 font-medium rounded-lg bg-primary hover:bg-black hover:transform-[scale(1.05)] hover:text-white transition-colors duration-200 focus:outline-none focus:transform-[scale(0.95)] focus:ring-offset-2" 
            onClick={handleCancelDelete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button 
            className="px-8 py-4 text-error font-medium rounded-lg bg-primary hover:bg-black hover:transform-[scale(1.05)] hover:text-white transition-colors duration-200 focus:outline-none focus:transform-[scale(0.95)] focus:ring-offset-2" 
            onClick={handleDeleteSkill}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Delete Skill
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DeleteSkillModal;
