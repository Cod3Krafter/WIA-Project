import React from 'react'
import getStarted from "../../assets/get_started3.jpg"

const FeatureSection = () => {
  return (
    <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
            <div className="p-12 py-15 bg-base-100">
                <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-start">
                    
                        {/* Left Column */}
                        <div className="space-y-8 min-h-[500px] p-5">
                            {/* Title */}
                            <h2 className="text-3xl font-bold text-base-content">
                                Get started with just few steps
                            </h2>

                        {/* Step 1 */}
                        <div className="flex items-start gap-4">
                            <div className="bg-neutral rounded-full w-6 h-6 mt-1"></div>
                            <div>
                            <h3 className="font-semibold text-lg">No cost to join</h3>
                            <p className="text-sm text-base-content/70">
                                Register and browse talent profiles, explore projects or even book a consultation.
                            </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-start gap-4">
                            <div className="border-2 border-primary w-6 h-6 mt-1 rounded-sm"></div>
                            <div>
                            <h3 className="font-semibold text-lg">Post a job and hire top talent</h3>
                            <p className="text-sm text-base-content/70">
                                Register and browse talent profiles, explore projects or even book a consultation.
                            </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex items-start gap-4">
                            <div className="bg-neutral rounded-full w-6 h-6 mt-1"></div>
                            <div>
                            <h3 className="font-semibold text-lg">
                                Work with the best—without breaking the bank
                            </h3>
                            <p className="text-sm text-base-content/70">
                                Register and browse talent profiles, explore projects or even book a consultation.
                            </p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex-column lg:flex justify-center-safe gap-5">
                            <button className="btn btn-soft w-1/3 h-16 text-l">Sign up for free</button>
                            <button className="btn btn-outline w-1/2 h-16 text-l">Learn how to hire</button>
                        </div>
                    </div>

                    {/* Right Column (Placeholder) */}
                    <div
                        className="rounded-2xl bg-base-300 min-h-[500px] w-full"
                        style={{
                            backgroundImage: `url(${getStarted})`,
                            backgroundSize: 'cover',    
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                        >
                    </div>

                </div>
            </div>

        </div>
    </div>
  )
}

export default FeatureSection