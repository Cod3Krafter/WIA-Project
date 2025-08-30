import React from "react";

const ProfileHeader = ({ user }) => {
  const { first_name, last_name, profile_picture, bio } = user;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Main Profile Card */}
      <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden border border-base-300">
        {/* Header Background */}
        <div className="bg-primary h-32 relative">
          {/* Profile Picture */}
          <div className="absolute -bottom-12 left-8">
            <img
              src={profile_picture || "https://i.pravatar.cc/200"}
              alt={`${first_name} ${last_name}`}
              className="size-32 rounded-full border-4 border-base-100 shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="pt-16 pb-8 px-8">
          {/* Name and Bio */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-base-content mb-2">
              {first_name} {last_name}
            </h1>
            {bio && (
              <p className="text-base-content/70 text-base leading-relaxed">
                {bio}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
