import { motion } from "framer-motion";

const EmptyState = ({ message }) => {
  return (
    <motion.div
      className="bg-amber-300 flex flex-col items-center justify-center text-center p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="w-full text-base-content/70 text-xl">{message}</p>
    </motion.div>
  );
};

export default EmptyState;
