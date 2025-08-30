import { Briefcase, ClipboardList, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    title: "Post a Job",
    description:
      "Describe your project and required skills. Our platform connects you with qualified freelancers ready to help.",
    icon: ClipboardList,
    step: "Step 1",
    accentColor: "text-blue-400",
    hoverColor: "hover:bg-blue-900/20",
  },
  {
    title: "Review Proposals",
    description:
      "Get matched with freelancers. Review profiles and compare proposals to find the perfect match.",
    icon: Briefcase,
    step: "Step 2",
    accentColor: "text-purple-400",
    hoverColor: "hover:bg-purple-900/20",
  },
  {
    title: "Hire & Pay Safely",
    description:
      "Choose your freelancer, agree on terms, and pay only after hiring. No upfront fees, no surprises.",
    icon: ShieldCheck,
    step: "Step 3",
    accentColor: "text-emerald-400",
    hoverColor: "hover:bg-emerald-900/20",
  },
];

export default function ClientsPay() {
  return (
    <div className="min-h-screen bg-base-100 p-8 flex flex-col justify-center">
      {/* Header */}
      <header className="text-4xl lg:text-5xl font-extrabold text-center mb-16 text-base-content">
        Clients Only Pay After Hiring
      </header>

      {/* Dynamic Box Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
        {steps.map(({ title, description, icon: Icon, step, accentColor, hoverColor }, index) => (
          <div
            key={index}
            className={`flex flex-col gap-5 bg-base-200 border border-base-300 rounded-2xl p-6 shadow-lg hover:shadow-2xl ${hoverColor} hover:border-opacity-60 transition-all duration-300 group`}
          >
            {/* Icon */}
            <div className="mb-4">
              <div className={`w-14 h-14 bg-base-300 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                <Icon className={`w-7 h-7 ${accentColor} group-hover:scale-110 transition-transform duration-300`} />
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-2 text-base-content">
              {title}
            </h3>
            
            <p className="min-h-20 max-h-20 text-base-content/80 text-base leading-relaxed">
              {description}
            </p>
            
            <div className={`flex justify-center mt-6 text-xl font-bold ${accentColor}`}>
              {step}
            </div>
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="flex justify-center">
        <Link to="/homepage" className="w-full max-w-xs">
          <button className="btn btn-primary text-lg w-full h-14 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            Discover Jobs
          </button>
        </Link>
      </div>
    </div>
  );
}