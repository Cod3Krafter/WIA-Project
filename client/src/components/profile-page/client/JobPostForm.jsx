import React, { useState } from "react";

const JobPostForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    category: "",
    deadline: "",
  });
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setErrors([]);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        else setErrors([data.message || "Something went wrong"]);
      } else {
        setStatus("Job posted successfully!");
        setFormData({
          title: "",
          description: "",
          budget: "",
          category: "",
          deadline: "",
        });

        if (onSuccess) onSuccess(); // e.g. refresh job list
      }
    } catch (err) {
      setErrors(["Network error or server issue"]);
      console.log(err)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <label className="block font-medium">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="textarea textarea-bordered w-full"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Budget ($)</label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
      </div>

      <div>
        <label className="block font-medium">Deadline</label>
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
      </div>

      <button type="submit" className="btn btn-primary mt-2">
        Post Job
      </button>

      {status && <p className="text-green-600 mt-2">{status}</p>}

      {errors.length > 0 && (
        <ul className="mt-2 text-red-500 list-disc list-inside">
          {errors.map((err, idx) => (
            <li key={idx}>{err}</li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default JobPostForm;
