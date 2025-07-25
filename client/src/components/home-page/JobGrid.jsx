const JobGrid = ({ jobs, setSelectedJob }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {jobs.length ? (
        jobs.map((job) => (
          <div key={job.id} className="card bg-base-100 shadow-md p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg mb-2">{job.title}</h3>
              <p className="text-sm text-gray-600">{job.description}</p>
            </div>
            <button
              onClick={() => {
                setSelectedJob(job);
                document.getElementById("apply-modal")?.showModal();
              }}
              className="btn btn-primary mt-4 w-full"
            >
              Apply
            </button>
          </div>
        ))
      ) : (
        <p className="col-span-full text-center">No jobs available.</p>
      )}
    </div>
  );
};

export default JobGrid;
