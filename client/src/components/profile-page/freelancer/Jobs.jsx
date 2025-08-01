import React, { useEffect, useState, useMemo } from "react";
import api from "../../../lib/axios";
import AppliedJobsCard from "../user-profile-page/AppliedJobsCard.jsx";
import JobPostForm from "../client/JobPostForm.jsx";
import { useAuth } from "../../../context/useAuth";

const Jobs = () => {
  const { activeRole } = useAuth();
  const [activeTab, setActiveTab] = useState("");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Memoize tabs based on role
  const tabs = useMemo(() => {
    return activeRole === "freelancer"
      ? ["Applied Jobs", "Saved Jobs"]
      : ["Post Job", "Posted Jobs"];
  }, [activeRole]);

  // Set default tab when tabs change
  useEffect(() => {
    if (tabs.length > 0) {
      setActiveTab(tabs[0]);
    }
  }, [tabs]);

  // Fetch jobs when activeTab or activeRole changes
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const headers = { "x-active-role": activeRole };
        let res;

        if (activeTab === "Applied Jobs") {
          res = await api.get("/job-applications/user", { headers });
          setAppliedJobs(res.data.applications || []);
          console.log(res.data.applications)
        } else if (activeTab === "Saved Jobs") {
          res = await api.get("/jobs/saved", { headers });
          setAppliedJobs(res.data.saved || []);
        } else if (activeTab === "Posted Jobs") {
          res = await api.get("/jobs/posted", { headers });
          setAppliedJobs(res.data.jobs || []);
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setAppliedJobs([]); // fallback to empty on error
      } finally {
        setLoading(false);
      }
    };

    if (activeTab && activeTab !== "Post Job") {
      fetchJobs();
    }
  }, [activeTab, activeRole]);

  return (
    <div className="p-4 space-y-4">
      {/* Tab Headers */}
      <div className="tabs tabs-boxed bg-base-200 p-1 flex gap-2 rounded-md">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "tab-active bg-primary text-white" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 bg-base-100 rounded-md shadow">
        {loading ? (
          <p>Loading...</p>
        ) : activeTab === "Post Job" ? (
          <JobPostForm />
        ) : appliedJobs.length === 0 ? (
          <p className="text-gray-500">No jobs found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appliedJobs.map((appliedJob, index) => (
              <AppliedJobsCard key={index} appliedJob={appliedJob} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
