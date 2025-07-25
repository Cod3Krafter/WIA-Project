import { Briefcase, ClipboardList, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";


const steps = [
  {
    title: "Post a Job",
    description:
      "Describe your project and required skills. Our platform connects you with qualified freelancers ready to help.",
    icon: ClipboardList,
    step: "Step 1",
  },
  {
    title: "Review Proposals",
    description:
      "Get matched with freelancers. Review profiles and compare proposals to find the perfect match.",
    icon: Briefcase,
    step: "Step 2",
  },
  {
    title: "Hire & Pay Safely",
    description:
      "Choose your freelancer, agree on terms, and pay only after hiring. No upfront fees, no surprises.",
    icon: ShieldCheck,
    step: "Step 3",
  },
];

export default function ClientsPay() {
  return (
    <div className="min-h-screen bg-base-200 p-8 flex flex-col justify-center">
      {/* Header */}
      <header className="text-4xl font-extrabold text-center mb-16 text-base-content">
        Clients Only Pay After Hiring
      </header>

      {/* Dynamic Box Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
        {steps.map(({ title, description, icon: Icon, step }, index) => (
          <div
            key={index}
            className="flex flex-col gap-5 bg-gray-600 border border-neutral rounded-2xl p-6 shadow-md hover:shadow-[0_4px_30px_white]/25 transition"
          >

            {/* ✅ RENDER ICON */}
            <div className="mb-4 text-primary">
              <Icon className="w-10 h-10" />
            </div>
            
            <h3 className="text-xl font-semibold mb-2 text-base-content">
              {title}
            </h3>
            
            <p className="min-h-20 max-h-20 text-base-content text-lg leading-relaxed">
              {description}
            </p>
            
            <div className="flex justify-center mt-6 text-2xl font-bold text-white">{step}</div>
          </div>
        ))}

      </div>

      {/* Button */}
      <div className="flex justify-center">
        <Link to="/homepage" className="w-full max-w-xs">
          <button className="btn btn-primary text-lg w-full h-14 rounded-xl shadow-md hover:shadow-lg transition">
            Discover Jobs
          </button>
        </Link>
      </div>

    </div>
  );
}
