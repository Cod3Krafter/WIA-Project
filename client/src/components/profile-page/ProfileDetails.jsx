import React, { useEffect, useState } from "react";
import SkillsAndProjects from "./freelancer/SkillsAndProjects.jsx";
import api from "../../lib/axios.js";
import { useParams } from "react-router-dom";

const ProfileDetails = () => {
  const {id} = useParams();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get(`/skill/user/${id}`);
        setSkills(res.data);
        console.log(res.data)
        console.log(skills)
      } catch (err) {
        console.error("Failed to fetch skills:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);
  return (
    <div className="tabs tabs-boxed">
      <input
        type="radio"
        name="profile_details_tab"
        className="tab text-lg"  // ⬅️ Increased font size
        aria-label="Skills and Projects"
        defaultChecked
      />
      <div className="tab-content bg-base-100 p-6">
        {loading ? <p>Loading...</p> : <SkillsAndProjects skills={skills} />}
      </div>

      <input
        type="radio"
        name="profile_details_tab"
        className="tab text-lg"  // ⬅️ Increased font size
        aria-label="Others"
      />
      <div className="tab-content bg-base-100 p-6">
        <p>Others</p>
      </div>
    </div>

  );
};

export default ProfileDetails;
