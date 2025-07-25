const JobApplyModal = ({ selectedJob, formData, setFormData }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/applyToJob", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ job_id: selectedJob?.id, ...formData }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Failed to apply.");
      } else {
        alert("Application submitted successfully.");
        document.getElementById("apply-modal")?.close();
        setFormData({
          proposal: "",
          expected_budget: "",
          freelancer_contact: "",
        });
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <dialog id="apply-modal" className="modal">
      <div className="modal-box max-w-xl">
        <h3 className="font-bold text-lg mb-4">Apply to {selectedJob?.title}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Proposal</label>
            <textarea
              className="textarea textarea-bordered w-full"
              value={formData.proposal}
              onChange={(e) => setFormData({ ...formData, proposal: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label">Expected Budget</label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={formData.expected_budget}
              onChange={(e) => setFormData({ ...formData, expected_budget: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label">Freelancer Contact</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formData.freelancer_contact}
              onChange={(e) => setFormData({ ...formData, freelancer_contact: e.target.value })}
              required
            />
          </div>

          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              Submit Application
            </button>
          </div>
        </form>
            <form method="dialog">
              <button className="btn">Cancel</button>
            </form>
      </div>
    </dialog>
  );
};

export default JobApplyModal;
    