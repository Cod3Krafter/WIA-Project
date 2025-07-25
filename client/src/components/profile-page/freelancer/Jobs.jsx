import React, { useEffect, useState } from "react";
import api from "../../../lib/axios.js"; 

const Jobs = () => {
  const [tabs, setTabs] = useState([
    { name: "Saved Jobs", content: "Jobs you've saved for later.", jobs: [] },
    { name: "Applied Jobs", content: "Jobs you've applied to.", jobs: [] },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await api.get("/job-applications/my");

        const appliedJobs = response.data.applications || response.data;

        setTabs((prevTabs) => {
          const updatedTabs = [...prevTabs];
          updatedTabs[1].jobs = appliedJobs.map((job) => ({
            title: job.job_title,
            company: "Client", // or fetch client info if needed
            description: job.proposal,
          }));
          return updatedTabs;
        });
      } catch (error) {
        console.error("Failed to fetch applied jobs:", error);
      }
    }

    fetchJobs();
  }, []);

  return (
    <div className="tabs tabs-box flex flex-wrap">
      {tabs.map((tab, index) => (
        <React.Fragment key={index}>
          <input
            type="radio"
            name="jobs_tab"
            className="tab"
            aria-label={tab.name}
            checked={activeIndex === index}
            onChange={() => setActiveIndex(index)}
          />
          <div className="tab-content bg-base-100 border-base-300 p-6 space-y-4">
            <p className="text-lg font-medium">{tab.content}</p>
            <div className="space-y-3">
              {tab.jobs.map((job, i) => (
                <div
                  key={i}
                  className="p-4 bg-base-200 rounded-lg shadow-sm border"
                >
                  <h3 className="text-md font-semibold">{job.title}</h3>
                  <p className="text-sm text-gray-500">{job.company}</p>
                  <p className="text-sm">{job.description}</p>
                </div>
              ))}
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Jobs;
