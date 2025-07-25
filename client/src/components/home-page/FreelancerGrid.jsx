import FreelancerCard from "../landing-page/FreelancerCard";

const FreelancerGrid = ({ freelancers, onViewProfile }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {freelancers.length ? (
        freelancers.map((freelancer) => (
          <FreelancerCard key={freelancer.id} freelancer={freelancer} onViewProfile={onViewProfile} />
        ))
      ) : (
        <p className="col-span-full text-center">No freelancers available.</p>
      )}
    </div>
  );
};

export default FreelancerGrid;
