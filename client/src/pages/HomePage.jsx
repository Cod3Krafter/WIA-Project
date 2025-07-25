import FreelancerCard from "../components/landing-page/FreelancerCard.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ExploreSection from "../components/home-page/ExploreSection.jsx";
import {freelancers} from "../data/freelancers.js"
import { jobs } from "../data/jobs.js";

export default function HomePage() {


  // 🔹 Display logic
  if (!freelancers || freelancers.length === 0) {
    return <p className="text-center text-gray-500">No freelancers found.</p>;
  }

  return (
    <div className="relative min-h-screen flex flex-col gap-4 bg-base-200 text-base-content px-4 py-8 md:px-8">
      <div className='fixed z-50 top-0 right-0 left-0'>
        <Navbar/>
      </div>
      <div className="py-7">
        <ExploreSection freelancers={freelancers} jobs={jobs}/>
      </div>
      {/* <div className='z-50 top-100 right-0 left-0'>
      </div> */}
    </div>
  );
}
