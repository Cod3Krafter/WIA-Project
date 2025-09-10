import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/landing-page/Hero'
import Footer from '../components/Footer'
import FeatureSection from '../components/landing-page/FeatureSection'
import ExplorePros from '../components/landing-page/ExplorePros'
import ClientsPay from '../components/landing-page/ClientsPay'
import {fadeInUp, fadeInLeft, fadeInRight, fadeInDown} from "../components/ui/animations"
import { motion } from 'framer-motion'



const LandingPage = () => {
  return (
    <div className="relative min-h-screen flex flex-col gap-12 bg-base-200 text-base-content px-4 py-8 md:px-8">

      {/* Hero - Fade Up */}
      <motion.div
        className="relative will-change-transform"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <Hero />
      </motion.div>

      {/* Feature Section - Fade Left */}
      <motion.div
        className="relative will-change-transform"
        variants={fadeInLeft}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <FeatureSection />
      </motion.div>

      {/* Explore Pros - Fade Right */}
      <motion.div
        className="relative will-change-transform"
        variants={fadeInRight}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <ExplorePros />
      </motion.div>

      {/* Clients Pay - Fade Down */}
      <motion.div
        className="relative will-change-transform"
        variants={fadeInDown}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <ClientsPay />
      </motion.div>
    </div>
  )
}

export default LandingPage
