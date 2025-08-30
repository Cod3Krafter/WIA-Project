import { Check, User, FileText, Camera, ScanFace } from "lucide-react";

const StepProgress = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, label: "Account", icon: User },
    { number: 2, label: "Credentials", icon: FileText },
    { number: 3, label: "WIA Bio", icon: ScanFace },
    { number: 4, label: "Photo", icon: Camera },
  ];

  return (
    <div className="w-full px-2 sm:px-4">
      <div className="flex items-center justify-between sm:justify-around relative max-w-md mx-auto">
        {/* Background connecting line - responsive positioning */}
        <div className="absolute top-5 sm:top-6 left-6 right-6 sm:left-8 sm:right-8 h-0.5 bg-gray-200 -z-10" />
        
        {steps.map((stepItem, index) => {
          const { number, label, icon: Icon } = stepItem;
          const isActive = number === currentStep;
          const isCompleted = number < currentStep;
          
          return (
            <div key={number} className="flex flex-col items-center relative z-10">
              {/* Step circle - responsive sizing */}
              <div
                className={`
                  flex items-center justify-center rounded-xl font-semibold 
                  transition-all duration-500 ease-in-out transform
                  w-10 h-10 sm:w-12 sm:h-12
                  ${isActive 
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-110" 
                    : isCompleted 
                    ? "bg-green-500 text-white shadow-md" 
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
              
              {/* Step label - responsive typography */}
              <span
                className={`
                  text-xs sm:text-sm font-medium mt-1 sm:mt-2 transition-colors duration-300 text-center
                  ${isActive 
                    ? "text-blue-600" 
                    : isCompleted 
                    ? "text-green-600" 
                    : "text-gray-400"
                  }
                `}
              >
                {label}
              </span>
            </div>
          );
        })}
        
        {/* Animated progress line - responsive positioning */}
        <div 
          className="absolute top-5 sm:top-6 left-5 sm:left-6 h-0.5 bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500 ease-in-out -z-5"
          style={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
            maxWidth: 'calc(100% - 40px)',
            transformOrigin: 'left'
          }}
        />
      </div>
    </div>
  );
};

export default StepProgress;