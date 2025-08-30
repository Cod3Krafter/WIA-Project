import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { containerVariants, itemVariants, loadingTextVariants } from "../components/ui/animations";

const TooManyRequests = () => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const retryUntil = localStorage.getItem("retryUntil");
    if (retryUntil) {
      const interval = setInterval(() => {
        const diff = Math.max(0, Math.floor((retryUntil - Date.now()) / 1000));
        setTimeLeft(diff);
        if (diff <= 0) {
          clearInterval(interval);
          window.location.href = "/"; // redirect back to home or refresh
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, []);

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen px-6 bg-base-200 text-base-content"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Title */}
      <motion.h1
        variants={itemVariants}
        className="text-5xl font-extrabold mb-6 text-white text-center"
      >
        ⏳ Too Many Requests
      </motion.h1>

      {/* Message */}
      <motion.p
        variants={itemVariants}
        className="text-lg md:text-xl text-base-content/80 mb-4"
      >
        Please wait <span className="font-semibold text-xl text-white">{timeLeft}</span> seconds
        before trying again.
      </motion.p>

      {/* Animated Loading Text */}
      <motion.p
        variants={loadingTextVariants}
        animate="pulse"
        className="text-sm md:text-base text-base-content/60"
      >
        Refreshing soon...
      </motion.p>
    </motion.div>
  );
};

export default TooManyRequests;
