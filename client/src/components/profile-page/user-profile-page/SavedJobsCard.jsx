import React from "react";
import { motion } from "framer-motion";
import { Send, Trash2, User, Calendar, DollarSign, Tag } from "lucide-react";
import { 
  projectCardVariants, 
  buttonVariants 
} from "../../../components/ui/animations";

const SavedJobsCard = ({ savedJob, onApply, onDelete }) => {
  return (
    <motion.div
      className="p-4 bg-base-200 rounded-lg shadow-sm border border-base-300 hover:shadow-md transition-shadow"
      variants={projectCardVariants}
      whileHover="hover"
      layout
    >
      <motion.div 
        className="flex flex-col justify-between space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Title + Description */}
        <div>
          <motion.h3 
            className="text-xl font-semibold line-clamp-2"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {savedJob.title}
          </motion.h3>
          <motion.p 
            className="min-h-15 text-lg text-base-content/70 mt-1 line-clamp-2"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {savedJob.description}
          </motion.p>
        </div>

        {/* Job Details */}
        <motion.div 
          className="bg-base-300/50 p-4 rounded-lg space-y-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
        >
          <motion.div 
            className="flex items-center gap-2 text-base text-base-content/80"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <DollarSign className="size-4 text-green-500" />
            <span className="font-medium">Budget:</span> ${savedJob.budget}
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-2 text-base text-base-content/80"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Tag className="size-4 text-blue-500" />
            <span className="font-medium">Category:</span> {savedJob.category}
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-2 text-base text-base-content/80"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Calendar className="size-4 text-orange-500" />
            <span className="font-medium">Deadline:</span> {savedJob.deadline}
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-2 text-base text-base-content/80"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
          >
            <User className="size-4 text-purple-500" />
            <span className="font-medium">Posted by:</span> {savedJob.client_first_name} {savedJob.client_last_name}
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={onApply}
            className="flex items-center gap-2 px-5 py-2 text-lg bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            <Send className="size-4" /> Apply
          </motion.button>

          <motion.button
            onClick={() => onDelete(savedJob.id)}
            className="flex items-center gap-2 px-5 py-2 text-lg bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            <Trash2 className="size-4" /> Delete
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SavedJobsCard;