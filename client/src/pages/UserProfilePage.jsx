  import { useEffect, useState } from "react";
  import { useAuth } from "../context/useAuth.jsx";
  import UserProfileDetails from "../components/profile-page/user-profile-page/UserProfileDetails.jsx";
  import UserProfileHeader from "../components/profile-page/user-profile-page/UserProfileHeader.jsx";
  import UpdateProfileModal from "../components/profile-page/user-profile-page/modals/UpdateProfileModal.jsx";
  import api from "../lib/axios.js";
  import toast from "react-hot-toast";

  const UserProfilePage = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);
    const [contactData, setContactData] = useState(null);
    const [showEditContactModal, setShowEditContactModal] = useState(false);

    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const [profileRes, contactRes] = await Promise.all([
            api.get(`/users/${user.id}`),
            api.get(`/contact/${user.id}`),
          ]);

          setUserData(profileRes.data);
          setContactData(contactRes.data);
        } catch (err) {
          console.error("Error fetching profile or contact data:", err);
        }
      };

      if (user?.id) fetchProfile();
    }, [user]);

    const handleShowModal = () => setShowEditContactModal(true);

    const normalizedContacts = contactData
      ? contactData.reduce((acc, c) => {
          acc[c.type] = c.value;
          return acc;
        }, {})
      : {};

    if (!userData)
      return <div className="text-white text-center mt-20">Loading profile...</div>;

    return (
      <div className="min-h-screen bg-base-200 text-base-content px-4 sm:px-6 md:px-8 lg:px-16 py-10 pt-35 flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Profile Header */}
        <div className="md:w-1/3">
          <UserProfileHeader
            user={{ ...userData, ...normalizedContacts }}
            onEditContacts={handleShowModal}
          />
        </div>

        {/* Profile Details */}
        <div className="md:w-2/3">
          <UserProfileDetails user={userData} />
        </div>

        {/* Edit Contact Modal */}
        <UpdateProfileModal
            isOpen={showEditContactModal}
            onClose={() => setShowEditContactModal(false)}
            user={{ ...userData, ...normalizedContacts }}
            onProfileUpdated={(updated) => setUserData((prev) => ({ ...prev, ...updated }))}
          />
      </div>
    );
  };

  export default UserProfilePage;
