// ProfileDetails.jsx
import { useEffect, useState } from "react";
import SkillsAndProjects from "../../profile-page/freelancer/SkillsAndProjects.jsx";
import Jobs from "../../profile-page/freelancer/Jobs.jsx"
import api from "../../../lib/axios.js";

const UserProfileDetails = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await api.get("/skill", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSkills(res.data.skills);
      } catch (err) {
        console.error("Failed to fetch skills:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);   

  return (
    <div className="tabs tabs-box">
      <input
        type="radio"
        name="profile_details_tab"
        className="tab"
        aria-label="Skills and Projects"
        defaultChecked
      />
      <div className="tab-content bg-base-100 p-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <SkillsAndProjects skills={skills} />
        )}
      </div>

      <input type="radio" name="profile_details_tab" className="tab" aria-label="Jobs" />
        <div className="tab-content bg-base-100 p-6">
            <Jobs/>
        </div>
    </div>
  );
};

export default UserProfileDetails;
