import { useState, useEffect } from "react";
import api from "../../lib/axios"; // adjust the path to where your `api.js` is located
import ExploreTab from "./ExploreTab";
import FreelancerGrid from "./FreelancerGrid";
import JobGrid from "./JobGrid";
import JobApplyModal from "./JobApplyModal";

const ExploreSection = () => {
  const [activeTab, setActiveTab] = useState("freelancers");
  const [freelancers, setFreelancers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    proposal: "",
    expected_budget: "",
    freelancer_contact: "",
  });

  const fetchFreelancers = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const res = await api.get("/users/freelancers", {
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      setFreelancers(res.data || []);
      console.log(res.data)
    } catch (err) {
      console.error("Error fetching freelancers:", err);
    }
  };

  const fetchJobs = async () => {
    const token = localStorage.getItem('accessToken')
    try {
      const res = await api.get("/jobs/jobposts", {
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      setJobs(res.data || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "freelancers") {
      fetchFreelancers();
    } else if (activeTab === "jobs") {
      fetchJobs();
    }
  }, [activeTab]);

  return (
    <div className="relative bg-base-300 mt-10">
      <div className="mx-auto px-4 py-6">
        <ExploreTab activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "freelancers" ? (
          <FreelancerGrid freelancers={freelancers} />
        ) : (
          <JobGrid jobs={jobs} setSelectedJob={setSelectedJob} />
        )}

        <JobApplyModal
          selectedJob={selectedJob}
          formData={formData}
          setFormData={setFormData}
        />
      </div>
    </div>
  );
};

export default ExploreSection;
