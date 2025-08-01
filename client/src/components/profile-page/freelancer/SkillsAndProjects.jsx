// SkillsAndProjects.jsx
import React, { useState } from "react";
import ProjectModal from "./ProjectModal";

const SkillsAndProjects = ({ skills }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);

    if (!Array.isArray(skills)) {
    return <p>No skills available</p>;
  }

  return (
    <>
      <div className="tabs tabs-box flex flex-wrap">
        {skills.map((skill, index) => (
          <React.Fragment key={index}>
            <input
              type="radio"
              name="skills_tab"
              className="tab"
              aria-label={skill.skill_name}
              checked={activeIndex === index}
              onChange={() => setActiveIndex(index)}
            />
            <div className="tab-content bg-base-100 border-base-300 p-6 space-y-4">
              <p className="text-lg font-medium">{skill.description}</p>
              <div className="space-y-3">
                {skill.projects?.map((project, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedProject(project)}
                    className="p-4 bg-base-200 rounded-lg shadow-sm border cursor-pointer hover:bg-base-300 transition"
                  >
                    <h3 className="text-md font-semibold">{project.title}</h3>
                    <p className="text-sm text-gray-500">{project.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
};

export default SkillsAndProjects;
