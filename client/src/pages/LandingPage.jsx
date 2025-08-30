import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/landing-page/Hero'
import Footer from '../components/Footer'
import FeatureSection from '../components/landing-page/FeatureSection'
import ExplorePros from '../components/landing-page/ExplorePros'
import ClientsPay from '../components/landing-page/ClientsPay'
import { motion } from 'framer-motion'

// Variants for different directions
const fadeInUp = {
  hidden: { opacity: 0, y: 40, position: "relative" },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1, ease: "easeOut" } 
  }
}

const fadeInLeft = {
  hidden: { opacity: 0, x: -60, position: "relative" },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
}

const fadeInRight = {
  hidden: { opacity: 0, x: 30, position: "relative" },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
}

const fadeInDown = {
  hidden: { opacity: 0, y: -40, position: "relative" },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
}

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
