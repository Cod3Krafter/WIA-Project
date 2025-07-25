import React from 'react'
import { Link } from 'react-router-dom'
import bgImage from '../../assets/hero_img.jpg'

const Hero = () => {
  return (
    <div
      className="hero min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="max-h-96 h-1/2 p-8 rounded-[2rem] shadow-md sm:max-w-xl w-full space-y-10 bg-base-100/25 backdrop-blur-md">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-base-content">
          Connecting clients with <br /> designers to work, <br /> interact and achieve
        </h1>

        {/* Button Toggle Group */}
        <div className="bg-base-300 rounded-full p-1 flex w-full max-w-md mx-auto">
          <Link
            to="/homepage"
            className="btn btn-sm rounded-full bg-base-100 text-base-content flex-1"
          >
            Find talent
          </Link>
          <Link
            to="/homepage"
            className="btn btn-sm rounded-full bg-neutral text-neutral-content flex-1"
          >
            Browse Jobs
          </Link>
        </div>

        {/* Search Input */}
        <div className="w-full max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search designers, jobs..."
            className="input input-lg w-full p-6 rounded-full"
          />
        </div>
      </div>
    </div>
  )
}

export default Hero