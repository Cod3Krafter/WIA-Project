import { motion } from "framer-motion";

const SkillDetails = ({ skill, itemVariants }) => {
  return (
    <motion.div 
      className="mb-6"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 
        className="text-3xl font-semibold mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {skill.skill_name}
      </motion.h2>
      <motion.p 
        className="text-lg text-base-content/80 leading-relaxed"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {skill.description}
      </motion.p>
    </motion.div>
  );
};

export default SkillDetails;
