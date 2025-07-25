const ExploreTab = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: "freelancers", label: "Freelancers" },
    { key: "jobs", label: "Find Jobs" },
  ];

  return (
    <div
      role="tablist"
      className="tabs tabs-box tabs-xl gap-5 bg-base-200 rounded-xl mb-6 shadow"
    >
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          role="tab"
          onClick={() => setActiveTab(key)}
          className={`tab px-6 py-2 font-semibold text-base transition duration-300 ${
            activeTab === key
              ? "tab-active bg-primary text-white"
              : "bg-base-100 hover:bg-primary hover:text-white"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default ExploreTab;
