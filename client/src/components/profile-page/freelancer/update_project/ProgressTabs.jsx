import { motion } from "framer-motion";
import { tabVariants } from "../../../ui/animations";

const ProgressTabs = ({ step, setStep, total }) => (
  <div className="tabs tabs-boxed flex justify-center mb-4">
    {Array.from({ length: total }).map((_, i) => (
      <motion.button
        key={i}
        className="tab flex-1"
        variants={tabVariants}
        animate={step === i ? "active" : "inactive"}
        onClick={() => setStep(i)}
      >
        Step {i + 1}
      </motion.button>
    ))}
  </div>
);
export default ProgressTabs;
