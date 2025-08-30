import { useState, useEffect } from "react";
import api from "../../lib/axios"; 
import ExploreTab from "./ExploreTab";
import FreelancerGrid from "./FreelancerGrid";
import JobGrid from "./JobGrid";
import JobApplyModal from "./JobApplyModal";
import { motion, AnimatePresence } from "framer-motion";

const ExploreSection = () => {
  const [activeTab, setActiveTab] = useState("freelancers");
  const [freelancers, setFreelancers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    proposal: "",
    expected_budget: "",
    freelancer_contact: "",
  });
  const [searchQuery, setSearchQuery] = useState(""); 
  const [searchDate, setSearchDate] = useState(""); 
  
  // 📄 Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const fetchFreelancers = async () => {
    try {
      const res = await api.get("/users/freelancers");
      setFreelancers(res.data || []);
    } catch (err) {
      console.error("Error fetching freelancers:", err);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs/jobposts");
      setJobs(res.data || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "freelancers") {
      fetchFreelancers();
    } else if (activeTab === "jobs") {
      fetchJobs();
    }
  }, [activeTab]);

  // Reset to first page when tab changes or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, searchDate]);

  // 🔎 Filters
  const filteredFreelancers = freelancers.filter((f) =>
    `${f.first_name} ${f.last_name} ${f.bio || ""}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const filteredJobs = jobs.filter((j) => {
    const matchesText = `${j.title} ${j.description || ""}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesDate = searchDate
      ? new Date(j.created_at) >= new Date(searchDate)
      : true;

    return matchesText && matchesDate;
  });

  // 📄 Pagination data
  const currentData = activeTab === "freelancers" ? filteredFreelancers : filteredJobs;
  const totalItems = currentData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = currentData.slice(startIndex, endIndex);

  // 📄 Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPrevious = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };

  const goToNext = () => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push("...");
      }
      for (let i = startPage; i <= endPage; i++) pages.push(i);
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  // ✨ Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="bg-base-300 mt-10">
      <div className="mx-auto px-4 py-6">
        <ExploreTab activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* 🔍 Search + Date Input */}
        <div className="my-4 flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-13 max-w-[500px] min-w-[200px] input input-bordered w-full text-lg p-3"
          />
          {activeTab === "jobs" && (
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="h-13 max-w-[500px] min-w-[200px] input input-bordered w-full text-lg p-3"
            />
          )}
        </div>

        <div className="mb-4 text-sm text-base-content/70">
          Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} {activeTab}
        </div>

        {/* 📄 Render grids with animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + currentPage + searchQuery + searchDate} // re-animate on changes
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="w-full"
          >
            {activeTab === "freelancers" ? (
              <motion.div variants={itemVariants}>
                <FreelancerGrid freelancers={currentItems} />
              </motion.div>
            ) : (
              <motion.div variants={itemVariants}>
                <JobGrid jobs={currentItems} setSelectedJob={setSelectedJob} />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 📄 Pagination Controls */}
        {totalPages > 1 && (
          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="join">
              <button
                className={`join-item btn ${currentPage === 1 ? "btn-disabled" : ""}`}
                onClick={goToPrevious}
                disabled={currentPage === 1}
              >
                «
              </button>
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  className={`join-item btn ${page === currentPage ? "btn-active" : ""} ${
                    page === "..." ? "btn-disabled" : ""
                  }`}
                  onClick={() => page !== "..." && goToPage(page)}
                  disabled={page === "..."}
                >
                  {page}
                </button>
              ))}
              <button
                className={`join-item btn ${currentPage === totalPages ? "btn-disabled" : ""}`}
                onClick={goToNext}
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          </motion.div>
        )}

        {/* Items per page selector */}
        <motion.div
          className="mt-4 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="form-contro text-center">
            <label className="label text-center">
              <span className="label-text text-sm mb-2">Items per page:</span>
            </label>
            <select
              className="select select-bordered select-sm"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>
        </motion.div>

        {/* Modal (can animate inside JobApplyModal itself) */}
        <JobApplyModal
          selectedJob={selectedJob}
          formData={formData}
          setFormData={setFormData}
        />
      </div>
    </div>
  );
};

export default ExploreSection;
