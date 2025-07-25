import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/landing-page/Hero'
import Footer from '../components/Footer'
import FeatureSection from '../components/landing-page/FeatureSection'
import ExplorePros from '../components/landing-page/ExplorePros'
import ClientsPay from '../components/landing-page/ClientsPay'

const LandingPage = () => {
  return (
    <div className="relative min-h-screen flex flex-col gap-4 bg-base-200 text-base-content px-4 py-8 md:px-8">
       
        <div className='mt-10'>
            <Hero/>
        </div>
        <div>
            <FeatureSection/>
        </div>
        <div>
            <ExplorePros/>
        </div>
        <div>
            <ClientsPay/>
        </div>

    </div>

  )
}

export default LandingPage