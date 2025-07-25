import React, { useEffect, useState } from "react";
import ApplicantsList from "./ApplicantsList";
import JobPostForm from "./JobPostForm";


const ClientJobs = () => {
  const [tabs, setTabs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedApplicants, setSelectedApplicants] = useState([]);

  useEffect(() => {
    async function fetchClientJobs() {
      const response = await Promise.resolve([
        {
          name: "Post a Job",
          content: "Create a new job listing to find the right freelancer.",
          type: "form",
        },
        {
          name: "Posted Jobs",
          content: "Jobs you've posted so far.",
          type: "list",
          jobs: [
            {
              title: "Landing Page Design",
              description: "Need a mobile-first landing page in Figma.",
              status: "Open",
              applicants: [
                {
                    name: "Jane Doe",
                    email: "jane@example.com",
                    bio: "Creative UI/UX designer with 3 years of experience.",
                    skills: ["Figma", "Illustrator", "Wireframing"],
                },
                {
                    name: "John Smith",
                    email: "john@example.com",
                    bio: "Full Stack Developer experienced in MERN stack.",
                    skills: ["React", "Node.js", "MongoDB"],
                },
                ],
            },
            {
              title: "Build Admin Dashboard",
              description: "React + Tailwind based dashboard for analytics.",
              status: "In Progress",
              applicants: [],
            },
          ],
        },
      ]);
      setTabs(response);
    }

    fetchClientJobs();
  }, []);

  const handleViewApplicants = (applicants) => {
    setSelectedApplicants(applicants);
    setShowModal(true);
  };

  return (
    <>
      <div className="tabs tabs-box flex flex-wrap">
        {tabs.map((tab, index) => (
          <React.Fragment key={index}>
            <input
              type="radio"
              name="client_jobs_tab"
              className="tab"
              aria-label={tab.name}
              checked={activeIndex === index}
              onChange={() => setActiveIndex(index)}
            />
            <div className="tab-content bg-base-100 border-base-300 p-6 space-y-4">
              <p className="text-lg font-medium">{tab.content}</p>

              {tab.type === "form" && (
                <div className="mt-4">
                  <JobPostForm onSuccess={() => console.log("Job created")} />
                </div>
              )}

              {tab.type === "list" && (
                <div className="space-y-3">
                  {tab.jobs.map((job, i) => (
                    <div
                      key={i}
                      className="p-4 bg-base-200 rounded-lg shadow-sm border"
                    >
                      <h3 className="text-md font-semibold">{job.title}</h3>
                      <p className="text-sm text-gray-500">{job.description}</p>
                      <span className="text-xs font-medium badge badge-info mt-2">
                        {job.status}
                      </span>
                      <div className="mt-4">
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleViewApplicants(job.applicants)}
                        >
                          View Applicants
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>

      {showModal && (
        <ApplicantsList
          applicants={selectedApplicants}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default ClientJobs;
