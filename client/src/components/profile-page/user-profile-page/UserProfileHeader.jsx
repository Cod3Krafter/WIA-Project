import React from "react";
import { MessageCircleMore, SquareArrowOutUpRight, Mail, Pencil } from "lucide-react";

const UserProfileHeader = ({ user, onEditContacts }) => {
  const {
    first_name,
    last_name,
    profile_picture,
    bio,
    whatsapp,
    email,
    linkedin,
  } = user;

  const contactMethods = [
    { 
      label: "WhatsApp", 
      value: whatsapp, 
      icon: MessageCircleMore, 
      color: "text-green-500", 
      bg: "bg-green-100" 
    },
    { 
      label: "LinkedIn", 
      value: linkedin, 
      icon: SquareArrowOutUpRight, 
      color: "text-blue-600", 
      bg: "bg-blue-100" 
    },
    { 
      label: "Email", 
      value: email, 
      icon: Mail, 
      color: "text-red-500", 
      bg: "bg-red-100" 
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Main Profile Card */}
      <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden border border-base-300">
        {/* Header Background */}
        <div className="bg-primary h-32 relative">
          
          {/* Edit Button */}
          <button
            onClick={onEditContacts}
            className="btn btn-sm btn-outline btn-accent absolute right-11 top-28 flex gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-4 text-base sm:text-lg bg-base-100/20 backdrop-blur-sm border-0 w-fit"
          >
            <Pencil size={16} className="sm:hidden" />
            <Pencil size={18} className="hidden sm:block" />
            Edit
          </button>
          {/* Profile Picture */}
          <div className="absolute -bottom-12 left-4 sm:left-8">
            <img
              src={profile_picture || "https://i.pravatar.cc/300"}
              alt={`${first_name} ${last_name}`}
              className="size-32 sm:size-40 rounded-full border-4 border-base-100 shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="pt-12 sm:pt-16 pb-6 sm:pb-8 px-4 sm:px-8">
          {/* Name and Bio */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-base-content mb-2">
              {first_name} {last_name}
            </h1>
            {bio && (
              <p className="text-base-content/70 text-sm sm:text-base leading-relaxed">
                {bio}
              </p>
            )}
          </div>

          {/* Contact Methods */}
          <div>
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
              <h2 className="text-xl sm:text-2xl font-semibold text-base-content">
                Contact Information
              </h2>
            </div>
            
            {/* Single column grid for all screen sizes */}
            <div className="grid gap-3 sm:gap-4 grid-cols-1">
              {contactMethods.map(({ label, value, icon: Icon, color, bg }) => {
                if (!value) return null;

                return (
                  <div key={label} className="group">
                    <div className="bg-base-200 rounded-xl p-3 sm:p-4 hover:bg-base-300 transition-colors cursor-pointer border border-base-300 hover:border-primary/20">
                      <div className="flex items-center gap-6">
                        <div className={`p-2 rounded-lg ${bg} ${color} flex-shrink-0`}>
                          <Icon size={18} className="sm:hidden" />
                          <Icon size={20} className="hidden sm:block" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-base-content/60 uppercase tracking-wide">
                            {label}
                          </p>
                          <p className="text-sm sm:text-base font-semibold text-base-content mt-1 break-words">
                            {value}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;