import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProfileHeader from "../components/profile-page/ProfileHeader";
import ProfileDetails from "../components/profile-page/ProfileDetails";
import api from "../lib/axios";

const ProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

 useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await api.get(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user:", err);
      // Optional: redirect if unauthorized
      if (err.response?.status === 401) {
        // Navigate to login or show error
        console.log(err.response)
      }
    }
  };

  if (id) fetchProfile();
}, [id]);


  if (!user) return <div className="text-white">Loading profile...</div>;

  return (
    <div className="min-h-screen flex gap-10 bg-base-200 text-base-content px-4 py-24 md:px-8 relative">
      <ProfileHeader user={user} />
      <div>
        <ProfileDetails user={user} />
      </div>
    </div>
  );
};

export default ProfilePage;
