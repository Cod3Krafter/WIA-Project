import React from "react";

const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-lg shadow-xl w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 btn btn-sm btn-circle btn-ghost"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-3">{project.title}</h2>
        <img
          src={project.media}
          alt={project.title}
          className="w-full h-64 object-cover rounded mb-4"
        />
        <p>{project.description}</p>
      </div>
    </div>
  );
};

export default ProjectModal;
