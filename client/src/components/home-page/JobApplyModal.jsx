import { Formik } from "formik";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import {jobApplicationSchema} from "../../lib/validation/JobApplicationSchema.jsx";

const JobApplyModal = ({ selectedJob }) => {
  return (
    <dialog id="apply-modal" className="modal">
      <div className="modal-box max-w-full">
        {selectedJob && (
          <div className="flex gap-10">
            {/* 🧾 Job Details */}
            <div className="flex flex-1 flex-col gap-5">
              <div className="p-5 flex flex-col gap-2 justify-center bg-base-200">
                <h3 className="text-3xl font-bold mb-2">{selectedJob.title}</h3>
                <p className="text-2xl font-extrabold">${selectedJob.budget}</p>
                <p className="text-lg">{selectedJob.category}</p>
                <p className="text-lg text-red-600">
                  <strong>Deadline:</strong> {selectedJob.deadline}
                </p>
              </div>

              <div className="bg-base-300">
                <p className="text-white mb-3 p-5">{selectedJob.description}</p>
              </div>
            </div>

            {/* ✍️ Application Form */}
            <Formik
              initialValues={{
                proposal: "",
                expected_budget: "",
                freelancer_contact: "",
              }}
              validationSchema={jobApplicationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  await api.post("/job-applications", {
                    job_id: selectedJob.id,
                    ...values,
                    expected_budget: Number(values.expected_budget),
                  });
                  document.getElementById("apply-modal")?.close();
                  toast.success("Job application submitted");
                  resetForm();
                } catch (err) {
                  if (err.response?.status === 409) {
                    document.getElementById("apply-modal")?.close();
                    toast.error("You have already applied for this job.");
                    resetForm()
                  } else {
                    console.error("Error applying to job:", err);
                    toast.error("Something went wrong");
                  }
                  } finally {
                    setSubmitting(false);
                  }
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleSubmit,
                isSubmitting,
              }) => (
                <form
                  onSubmit={handleSubmit}
                  className="flex-1 space-y-8 px-7 py-4 bg-base-300"
                >
                  <div>
                    <label className="my-2 text-xl label font-semibold">
                      Proposal
                    </label>
                    <textarea
                      name="proposal"
                      className="textarea text-lg textarea-bordered w-full min-h-[300px]"
                      value={values.proposal}
                      onChange={handleChange}
                    />
                    {touched.proposal && errors.proposal && (
                      <p className="text-red-500">{errors.proposal}</p>
                    )}
                  </div>

                  <div>
                    <label className="label font-semibold mb-1">
                      Proposed Budget
                    </label>
                    <input
                      type="number"
                      name="expected_budget"
                      className="input input-bordered w-full"
                      value={values.expected_budget}
                      onChange={handleChange}
                    />
                    {touched.expected_budget && errors.expected_budget && (
                      <p className="text-red-500">{errors.expected_budget}</p>
                    )}
                  </div>

                  <div>
                    <label className="label font-semibold mb-1">
                      Your Contact Info
                    </label>
                    <input
                      type="text"
                      name="freelancer_contact"
                      className="input input-bordered w-full"
                      value={values.freelancer_contact}
                      onChange={handleChange}
                    />
                    {touched.freelancer_contact && errors.freelancer_contact && (
                      <p className="text-red-500">
                        {errors.freelancer_contact}
                      </p>
                    )}
                  </div>

                  <div className="modal-action flex justify-between">
                    <button
                      type="button"
                      className="btn"
                      onClick={() =>
                        document.getElementById("apply-modal")?.close()
                      }
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        )}
      </div>
    </dialog>
  );
};

export default JobApplyModal;
