import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";

const ProfileHeader = ({ user }) => {
  const {
    first_name,
    last_name,
    profile_picture,
    bio,
    github_url,
    linkedin_url,
    email,
  } = user;

  return (
    <div className="flex flex-col">
      <div className="card bg-base-100 w-96 shadow-sm">
        <figure className="px-10 pt-10">
          <img
            src={profile_picture || "https://i.pravatar.cc/200"}
            alt={`${first_name} ${last_name}`}
            className="rounded-full w-24 h-24 object-cover"
          />
        </figure>
        <div className="card-body items-center gap-5 text-center">
          <h2 className="card-title text-3xl">
            {first_name} {last_name}
          </h2>

          {/* Social Icons */}
          <div className="card-actions flex gap-5">
            {github_url && (
              <a href={github_url} target="_blank" rel="noopener noreferrer">
                <Github className="hover:text-primary transition" />
              </a>
            )}
            {linkedin_url && (
              <a href={linkedin_url} target="_blank" rel="noopener noreferrer">
                <Linkedin className="hover:text-primary transition" />
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`}>
                <Mail className="hover:text-primary transition" />
              </a>
            )}
          </div>

          {/* Bio */}
          <p className="text-sm text-gray-500">{bio || "No bio available."}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
