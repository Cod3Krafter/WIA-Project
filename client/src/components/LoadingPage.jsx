import { motion } from "framer-motion";
import { containerVariants, itemVariants, loadingSpinnerVariants, loadingTextVariants } from "../components/ui/animations";

export default function LoadingPage() {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen bg-base-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Spinner */}
      <motion.div
        className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        variants={loadingSpinnerVariants}
        animate="spin"
      />

      {/* Text */}
      <motion.p
        className="mt-6 text-xl font-medium text-base-content/80"
        variants={loadingTextVariants}
        animate="pulse"
      >
        Loading, please wait...
      </motion.p>

      {/* Optional dots */}
      <motion.div 
        className="flex gap-2 mt-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[0,1,2].map((i) => (
          <motion.span 
            key={i} 
            className="w-3 h-3 bg-primary rounded-full"
            variants={itemVariants}
            transition={{ delay: i * 0.2, repeat: Infinity, repeatDelay: 0.6 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
