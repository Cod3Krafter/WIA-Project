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
        if (err.response?.status === 401) {
          console.log(err.response);
        }
      }
    };

    if (id) fetchProfile();
  }, [id]);

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <p className="text-white text-lg">Loading profile...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-base-200 text-base-content px-4 sm:px-6 md:px-8 lg:px-16 py-10 pt-35 flex flex-col md:flex-row gap-8 md:gap-12">
      {/* Profile Header */}
      <div className="w-full md:w-1/3 flex-shrink-0">
        <ProfileHeader user={user} />
      </div>

      {/* Profile Details */}
      <div className="w-full md:w-2/3">
        <ProfileDetails user={user} onEditContacts={() => {}} />
      </div>
    </div>

  );
};

export default ProfilePage;
