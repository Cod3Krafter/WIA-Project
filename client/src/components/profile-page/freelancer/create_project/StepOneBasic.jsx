const StepOneBasic = ({ formData, handleChange, titleRef, skills }) => {
  return (
    <>
      {/* Skill */}
      <div className="form-control">
        <label className="label text-lg font-medium mb-2">
          Skill <span className="text-error">*</span>
        </label>
        <select
          name="skill_id"
          value={formData.skill_id}
          onChange={handleChange}
          className="select select-bordered w-full text-lg h-13"
          required
        >
          <option value="">
            {skills.length <= 0 ? "No skills available" : "Select Skill"}
          </option>
          {skills.map((skill) => (
            <option key={skill.id} value={skill.id}>
              {skill.skill_name}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div className="form-control">
        <label className="label text-lg font-medium mb-2">
          Project Title <span className="text-error">*</span>
        </label>
        <input
          ref={titleRef}
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter project title..."
          className="input input-bordered w-full h-13 text-lg"
          required
          maxLength={100}
        />
      </div>
    </>
  );
};

export default StepOneBasic;
