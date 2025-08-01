import React from "react";

const AppliedJobsCard = ({ appliedJob}) => {
  return (
    <div className="bg-white dark:bg-base-200 shadow-md rounded-xl p-4 border border-base-300 hover:shadow-lg transition duration-200">
      <h3 className="text-lg font-semibold mb-2 text-primary">{appliedJob.job_title}</h3>

      <p className="text-sm mb-2 text-gray-600 dark:text-gray-400">
        <span className="font-medium">Proposal:</span> {appliedJob.proposal}
      </p>

      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <span>
          <span className="font-medium">Budget:</span> ${appliedJob.expected_budget}
        </span>
        <span>
          <span className="font-medium">Submitted:</span>{" "}
          {new Date(appliedJob.submitted_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default AppliedJobsCard;
