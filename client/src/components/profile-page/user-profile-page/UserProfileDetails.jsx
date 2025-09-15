import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserSkillsAndProjects from "./UserSkillsAndProjects.jsx";
import Jobs from "../../profile-page/freelancer/Jobs.jsx";
import api from "../../../lib/axios.js";
import CreateSkillForm from "../freelancer/CreateSkillForm.jsx";
import CreateProjectForm from "../freelancer/CreateProjectForm.jsx";
import UpdateSkillForm from "../freelancer/UpdateSkillForm.jsx";
import DeleteSkillModal from "./modals/DeleteSkillModal.jsx";
import DeleteProjectModal from "./modals/DeleteProjectModal.jsx";
import toast from "react-hot-toast";
import {
  modalVariants,
  overlayVariants,
  buttonVariants,
  dropdownVariants,
  containerVariants,
  itemVariants,
  tabVariants
} from "../../ui/animations.jsx";
import { useAuth } from "../../../context/useAuth.jsx";

const UserProfileDetails = () => {
  const { activeRole } = useAuth(); // ✅ role context
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showProjectform, setShowProjectForm] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [activeTab, setActiveTab] = useState(
    activeRole === "client" ? "jobs" : "skills" // ✅ default tab based on role
  );
  const [showProjectDeleteModal, setShowProjectDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get("/skill/user");
        setSkills(res.data);
      } catch (err) {
        console.error("Failed to fetch skills:", err);
      } finally {
        setLoading(false);
      }
    };

    if (activeRole !== "client") {
      fetchSkills(); // ✅ only fetch skills for freelancers
    }
  }, [activeRole]);

  const handleCreateSkill = async (data) => {
    try {
      const res = await api.post("/skill", data);
      setSkills((prev) => [...prev, res.data.skill]);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to create skill:", err);
    }
  };

  const handleUpdateSkill = (updatedSkill) => {
    if (!updatedSkill || !updatedSkill.id) {
      toast.error("Failed to update skill - invalid data received");
      setShowUpdateModal(false);
      return;
    }

    setSkills((prev) =>
      prev.map((s) => (s.id === updatedSkill.id ? updatedSkill : s))
    );
    setShowUpdateModal(false);
    toast.success("Skill updated successfully");
  };

  // --- Skill deletion ---
  const handleDeleteSkillConfirm = (skill) => {
    setSkillToDelete(skill);
    setShowDeleteModal(true);
  };

  const handleDeleteSkill = async () => {
    if (!skillToDelete) return;

    try {
      await api.delete(`/skill/${skillToDelete.id}`);
      setSkills((prev) => prev.filter((skill) => skill.id !== skillToDelete.id));
      toast.success("Skill deleted successfully");
    } catch (err) {
      toast.error("Failed to delete skill");
    } finally {
      setShowDeleteModal(false);
      setSkillToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSkillToDelete(null);
  };

  // --- Project deletion ---
  const handleDeleteProjectRequest = (project) => {
    setProjectToDelete(project);
    setShowProjectDeleteModal(true);
  };

  const handleConfirmDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      const token = localStorage.getItem("accessToken");
      await api.delete(`/projects/${projectToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSkills((prev) =>
        prev.map((skill) => ({
          ...skill,
          projects:
            skill.projects?.filter((p) => p.id !== projectToDelete.id) || [],
        }))
      );

      toast.success("Project deleted successfully");
    } catch (err) {
      console.error("Failed to delete project:", err);
      toast.error("Failed to delete project");
    } finally {
      setShowProjectDeleteModal(false);
      setProjectToDelete(null);
    }
  };

  const handleCancelDeleteProject = () => {
    setShowProjectDeleteModal(false);
    setProjectToDelete(null);
  };

  const handleCreateProject = async (data) => {
    try {
      const res = await api.post("/projects", data);

      const updatedSkills = skills.map((skill) => {
        if (skill.id === parseInt(data.skill_id)) {
          return {
            ...skill,
            projects: [
              ...(skill.projects || []),
              {
                ...data,
                id: res.data?.projectId || Date.now(),
              },
            ],
          };
        }
        return skill;
      });

      setSkills(updatedSkills);
      setShowProjectForm(false);
      toast.success("Project created successfully");
    } catch (err) {
      toast.error("Failed to create project");
    }
  };

  return (
    <>
      <motion.div
        className="w-full px-2 sm:px-4 lg:px-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Tabs */}
        <motion.div
          className="tabs tabs-boxed mb-4 w-full justify-center sm:justify-start"
          variants={itemVariants}
        >

          <motion.button
            className={`tab text-lg flex-1 sm:flex-none ${
              activeTab === "jobs" ? "tab-active" : ""
            }`}
            variants={tabVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("jobs")}
          >
            Jobs
          </motion.button>
          
          {activeRole !== "client" && (
            <motion.button
              className={`tab text-lg flex-1 sm:flex-none ${
                activeTab === "skills" ? "tab-active" : ""
              }`}
              variants={tabVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("skills")}
            >
              <span className="hidden sm:inline">Skills and Projects</span>
              <span className="sm:hidden">Skills</span>
            </motion.button>
          )}

        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* ✅ Hide content for clients */}
          {activeRole !== "client" && activeTab === "skills" && (
            <motion.div
              key="skills"
              className="w-full bg-base-300 p-4 md:p-6 space-y-6 rounded-box"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Skills content */}
              <motion.div
                className="grid grid-cols-2 gap-2 sm:flex sm:flex-col lg:flex-row sm:gap-4 lg:justify-end"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.button
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 text-blue-600 font-medium rounded-lg bg-primary hover:bg-black hover:text-white transition-colors duration-200 focus:outline-none focus:ring-offset-2"
                >
                  Create a skill
                </motion.button>

                <motion.button
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setShowProjectForm(true)}
                  className="px-4 py-2 text-blue-600 font-medium rounded-lg bg-primary hover:bg-black hover:text-white transition-colors duration-200 focus:outline-none focus:ring-offset-2"
                >
                  Create project
                </motion.button>

                {/* Update Skill Dropdown */}
                <motion.div
                  className="dropdown dropdown-bottom"
                  variants={itemVariants}
                >
                  <motion.div
                    tabIndex={0}
                    role="button"
                    className="px-4 py-2 text-center text-blue-600 font-medium rounded-lg bg-primary hover:bg-black hover:text-white transition-colors duration-200 focus:outline-none focus:ring-offset-2"
                    variants={buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Update skill
                  </motion.div>
                  <motion.ul
                    className="dropdown-content z-10 menu p-2 shadow-lg bg-base-100 rounded-box w-52 max-h-48 overflow-y-auto"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {skills.map((skill, index) => (
                      <motion.li
                        key={skill.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <motion.button
                          onClick={() => {
                            setSelectedSkill(skill);
                            setShowUpdateModal(true);
                            document.activeElement?.blur();
                          }}
                          className="text-left w-full truncate hover:bg-base-200"
                          whileHover={{ x: 4 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                        >
                          {skill.skill_name}
                        </motion.button>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>

                {/* Delete Skill Dropdown */}
                <motion.div
                  className="dropdown dropdown-bottom"
                  variants={itemVariants}
                >
                  <motion.div
                    tabIndex={0}
                    role="button"
                    className="px-4 py-2 text-center text-red-600 font-medium rounded-lg bg-primary hover:bg-black hover:text-white transition-colors duration-200 focus:outline-none focus:ring-offset-2"
                    variants={buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Delete skill
                  </motion.div>
                  <motion.ul
                    className="dropdown-content z-10 menu p-2 shadow-lg bg-base-100 rounded-box w-52 max-h-48 overflow-y-auto"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {skills.map((skill, index) => (
                      <motion.li
                        key={skill.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <motion.button
                          onClick={() => {
                            handleDeleteSkillConfirm(skill);
                            document.activeElement?.blur();
                          }}
                          className="text-left w-full truncate hover:bg-error hover:text-error-content"
                          whileHover={{ x: 4 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                        >
                          {skill.skill_name}
                        </motion.button>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              </motion.div>

              {/* Content Area */}
              <AnimatePresence>
                {loading ? (
                  <motion.div
                    className="flex justify-center items-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="loading loading-spinner loading-lg"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <UserSkillsAndProjects
                      skills={skills}
                      onDeleteProject={handleDeleteProjectRequest}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === "jobs" && (
            <motion.div
              key="jobs"
              className="bg-base-100 p-3 sm:p-6 rounded-box w-full overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Jobs />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Animated Modals */}
      <AnimatePresence>
        {showModal && (
          <CreateSkillForm
            onClose={() => setShowModal(false)}
            onSubmit={handleCreateSkill}
          />
        )}

        {showProjectform && (
          <CreateProjectForm
            onClose={() => setShowProjectForm(false)}
            onSubmit={handleCreateProject}
          />
        )}

        {showUpdateModal && selectedSkill && (
          <UpdateSkillForm
            skill={selectedSkill}
            onClose={() => setShowUpdateModal(false)}
            onSubmit={handleUpdateSkill}
          />
        )}

        {/* Skill Delete Confirmation Modal */}
        <DeleteSkillModal
          showDeleteModal={showDeleteModal}
          skillToDelete={skillToDelete}
          handleCancelDelete={handleCancelDelete}
          handleDeleteSkill={handleDeleteSkill}
          overlayVariants={overlayVariants}
          modalVariants={modalVariants}
        />

        {/* Project Delete Confirmation Modal */}
        <DeleteProjectModal
          showProjectDeleteModal={showProjectDeleteModal}
          projectToDelete={projectToDelete}
          handleCancelDeleteProject={handleCancelDeleteProject}
          handleConfirmDeleteProject={handleConfirmDeleteProject}
          overlayVariants={overlayVariants}
          modalVariants={modalVariants}
        />
      </AnimatePresence>
    </>
  );
};

export default UserProfileDetails;
