import React from 'react';
import { Link } from 'react-router-dom';
import bgImage from '../../assets/hero_img.jpg';

const Hero = () => {
  return (
    <div
      className="hero min-h-screen mt-25 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-8 lg:px-12">
        <div className="bg-white/20 backdrop-blur-md p-8 sm:p-12 md:p-16 rounded-3xl shadow-lg w-full max-w-xl sm:max-w-2xl space-y-6 sm:space-y-8">
          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-snug text-white text-center">
            Connecting clients with <br /> designers to work, <br /> interact and achieve
          </h1>

          {/* Button Toggle Group */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 w-full">
            <Link
              to="/homepage"
              className="flex-1 text-center text-base sm:text-lg py-3 rounded-full bg-indigo-100 text-indigo-500 font-medium hover:bg-indigo-400 hover:text-white transition-all duration-300 shadow-sm"
            >
              Find Talent
            </Link>
            <Link
              to="/homepage"
              className="flex-1 text-center text-base sm:text-lg py-3 rounded-full border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-300 hover:text-gray-900 transition-all duration-300 shadow-sm"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
