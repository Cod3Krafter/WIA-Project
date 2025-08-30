import React from "react";
import { Link } from "react-router-dom";

const FreelancerCard = ({ freelancer}) => {
  const {
    id,
    first_name,
    last_name,
    profile_picture,
    bio,
    skill_name,
    created_at,
  } = freelancer;


  return (
    <div className="card bg-black shadow-md hover:shadow-lg transition">
      <div className="card-body p-8 text-start max-w-3xl min-h-52 space-y-7">
        {/* Avatar */}
        <div className="avatar">
          <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img src={profile_picture} alt={`${first_name} ${last_name}`} />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-white text-start sm:text-left">
          <h3 className="text-xl font-semibold">{first_name} {last_name}</h3>
          <p className="text-sm text-white mb-2 line-clamp-2">{bio}</p>

            <div className="flex flex-wrap gap-2 mb-2 justify-center sm:justify-start">
                <span className="badge badge-outline badge-sm">
                  {skill_name}
                </span>
            </div>

         <p className="text-xs text-gray-400">
          Joined {new Date(created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>

        </div>

        {/* CTA */}
        <Link to={`/profile/${id}`}>
          <button
            className="btn btn-primary"
          >
            View Profile
          </button>
        </Link>

      </div>
    </div>
  );
};

export default FreelancerCard;