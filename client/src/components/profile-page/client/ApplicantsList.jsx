// ./client/ApplicantsList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ApplicantsList = ({ jobId, onClose }) => {
  const [applicants, setApplicants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/job-applications/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setApplicants(res.data);
        setSelected(res.data[0] || null);
      } catch (err) {
        console.error("Failed to fetch applicants:", err);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchApplicants();
    }
  }, [jobId]);

  if (loading) return null; // or a spinner

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-4xl flex overflow-hidden">
        {/* Left Panel - List */}
        <div className="w-1/3 bg-base-200 p-4 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">Applicants</h2>
          {applicants.map((applicant, i) => (
            <button
              key={i}
              onClick={() => setSelected(applicant)}
              className={`block w-full text-left p-3 mb-2 rounded ${
                selected?.email === applicant.email
                  ? "bg-primary text-white"
                  : "bg-base-100"
              }`}
            >
              <p className="font-medium">{applicant.name}</p>
              <p className="text-sm text-gray-500">{applicant.email}</p>
            </button>
          ))}
        </div>

        {/* Right Panel - Profile */}
        <div className="w-2/3 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Applicant Profile</h2>
            <button onClick={onClose} className="btn btn-sm btn-outline">
              Close
            </button>
          </div>

          {selected ? (
            <div className="space-y-3">
              <p>
                <span className="font-semibold">Name:</span> {selected.name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {selected.email}
              </p>
              {selected.bio && (
                <p>
                  <span className="font-semibold">Bio:</span> {selected.bio}
                </p>
              )}
              {selected.skills && (
                <div>
                  <span className="font-semibold">Skills:</span>
                  <ul className="list-disc ml-5 mt-1">
                    {selected.skills.map((skill, idx) => (
                      <li key={idx}>{skill}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Select an applicant to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicantsList;
