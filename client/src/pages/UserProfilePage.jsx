import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth"; // adjust path if needed
import ProfileHeader from "../components/profile-page/ProfileHeader";
import api from "../lib/axios";
import UserProfileDetails from "../components/profile-page/user-profile-page/UserProfileDetails";

const UserProfilePage = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await api.get(`/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(res.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    if (user?.id) fetchProfile();
  }, [user]);

  if (!userData) return <div className="text-white">Loading profile...</div>;
  // console.log(userData)
  return (
    <>
      <div className="min-h-screen flex gap-10 bg-base-200 text-base-content px-4 py-24 md:px-8 relative">
        <ProfileHeader user={userData} />
        <div>
          <UserProfileDetails user={userData} />
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
