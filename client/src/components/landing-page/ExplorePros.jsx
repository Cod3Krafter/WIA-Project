import React from 'react'
import FreelancerCard from './FreelancerCard'
import { useNavigate } from 'react-router-dom'
import {Link} from 'react-router-dom'

const ExplorePros = () => {
  const navigate = useNavigate();
  const handleViewProfile = () =>{
    navigate(`/login`);
  }
  return (
    <section className="py-12 bg-base-100 text-base-content">
      <div className="max-w-7xl mx-auto px-4 lg:text-center space-y-20">

        {/* Section Title */}
        <h2 className="text-4xl font-bold">Explore various professionals</h2>

        {/* 4x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 mt-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <FreelancerCard
            key={index}
            freelancer={{
              first_name: `Jane${index + 1}`,
              last_name: "Doe",
              profile_picture: `https://i.pravatar.cc/150?img=${index + 1}`,
              bio: "Experienced web developer with a passion for UI/UX.",
              skills: [
                { skill_name: "React" },
                { skill_name: "Tailwind CSS" },
                { skill_name: "Node.js" },
              ],
              created_at: "2025-07-01T12:00:00Z",
            }}
            onViewProfile={()=>{handleViewProfile()}}
            />
          ))}

        </div>
        <Link to="/homepage">
          <p className="text-3xl text-white font-bold underline cursor-pointer">Find more professionals</p>  
        </Link>
      </div>
</section>


  )
}

export default ExplorePros