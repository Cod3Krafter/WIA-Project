import { useState, useEffect } from "react";
import api from "../../lib/axios";
import toast from "react-hot-toast";

const JobGrid = ({ jobs, setSelectedJob }) => {
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [savingJobs, setSavingJobs] = useState(new Set());

  // Fetch saved jobs when component mounts
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await api.get("/saved-jobs");
        const savedJobIds = res.data.jobs.map(job => job.id);
        setSavedJobs(new Set(savedJobIds));
      } catch (error) {
        console.error("Failed to fetch saved jobs:", error);
      }
    };

    fetchSavedJobs();
  }, []);

  const handleSaveJob = async (jobId) => {
    // Prevent multiple clicks while saving
    if (savingJobs.has(jobId)) return;

    setSavingJobs(prev => new Set([...prev, jobId]));

    try {
      const res = await api.post("/saved-jobs", { job_id: jobId });
      
      // Update saved jobs state based on the response
      if (res.data.message.includes("unsaved")) {
        setSavedJobs(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
      } else {
        setSavedJobs(prev => new Set([...prev, jobId]));
      }
      
      toast.success(res.data.message);
    } catch (error) {
      console.error("Failed to toggle save job:", error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setSavingJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.length > 0 ? (
        jobs.map((job) => {
          const isSaved = savedJobs.has(job.id);
          const isSaving = savingJobs.has(job.id);
          
          return (
            <div
              key={job.id}
              className="card bg-base-100 shadow-md p-10 flex flex-col justify-between"
            >
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-2xl mb-2">{job.title}</h3>
                <p className="text-lg text-gray-400 h-[90px] overflow-hidden text-ellipsis line-clamp-3">
                  {job.description}
                </p>
                <p className="text-md mt-2">Category: {job.category}</p>
                <p className="text-md">Budget: {job.budget}</p>
                <p className="text-md">Deadline: {job.deadline}</p>
              </div>

              <div className="w-full flex gap-5">
                <button
                  onClick={() => {
                    setSelectedJob(job);
                    document.getElementById("apply-modal")?.showModal();
                  }}
                  className="btn btn-primary flex-1 mt-4 py-6 text-lg"
                >
                  Apply
                </button>
                <button
                  onClick={() => handleSaveJob(job.id)}
                  disabled={isSaving}
                  className={`btn flex-1 mt-4 py-6 text-lg ${
                    isSaved 
                      ? "btn-success" 
                      : "btn-secondary"
                  } ${isSaving ? "loading" : ""}`}
                >
                  {isSaving 
                    ? "..." 
                    : isSaved 
                      ? "Saved ✓" 
                      : "Save Job"
                  }
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <p className="col-span-full text-center">No jobs available.</p>
      )}
    </div>
  );
};

export default JobGrid;