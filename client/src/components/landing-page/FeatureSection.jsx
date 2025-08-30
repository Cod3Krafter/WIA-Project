import React from "react";
import { Link} from 'react-router-dom'
import getStarted from "../../assets/get_started3.jpg";

const FeatureSection = () => {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse w-full">
        <div className="p-6 sm:p-10 lg:p-12 bg-base-100 w-full">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
            
            {/* Left Column */}
            <div className="space-y-8 min-h-[400px] md:min-h-[500px] p-2 sm:p-5">
              {/* Title */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content">
                Get started with just a few steps
              </h2>

              {/* Step 1 */}
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-neutral rounded-full w-5 h-5 sm:w-6 sm:h-6 mt-1"></div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg">
                    No cost to join
                  </h3>
                  <p className="text-sm text-base-content/70">
                    Register and browse talent profiles, explore projects or even
                    book a consultation.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="border-2 border-primary w-5 h-5 sm:w-6 sm:h-6 mt-1 rounded-sm"></div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg">
                    Post a job and hire top talent
                  </h3>
                  <p className="text-sm text-base-content/70">
                    Register and browse talent profiles, explore projects or even
                    book a consultation.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-neutral rounded-full w-5 h-5 sm:w-6 sm:h-6 mt-1"></div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg">
                    Work with the best—without breaking the bank
                  </h3>
                  <p className="text-sm text-base-content/70">
                    Register and browse talent profiles, explore projects or even
                    book a consultation.
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full">
                <button className="btn btn-soft w-full sm:w-1/2 lg:w-1/3 h-14 sm:h-16 text-base">
                <Link to={"/register"}>
                    Sign up for free
                </Link>
                  
                </button>
                <button className="btn btn-outline w-full sm:w-1/2 h-14 sm:h-16 text-base">
                  Learn how to hire
                </button>
              </div>
            </div>

            {/* Right Column (Image) */}
            <div
              className="rounded-2xl bg-base-300 min-h-[250px] sm:min-h-[350px] md:min-h-[500px] w-full"
              style={{
                backgroundImage: `url(${getStarted})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
