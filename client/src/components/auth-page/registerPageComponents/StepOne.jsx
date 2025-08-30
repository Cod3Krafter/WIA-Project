import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, User, UsersRound } from "lucide-react";
import FormField from "./FormField";

const StepOne = ({ 
  values, 
  handleChange, 
  handleBlur, 
  errors, 
  touched, 
  onNext 
}) => {
  const isValid = values.first_name && values.last_name;

  return (
    <div className="space-y-4 sm:space-y-6 animate-in text-white slide-in-from-right-4 duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* First Name */}
        <FormField 
          label="First Name" 
          error={errors.first_name} 
          touched={touched.first_name} 
          required
        >
          <div className="relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
              <User className="h-4 w-4 sm:h-6 sm:w-6" />
            </span>
            <Input
              id="first_name"
              name="first_name"
              type="text"
              value={values.first_name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your first name"
              className="pl-12 h-14 sm:h-16 md:h-18 text-neutral-50 sm:text-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all w-full"
            />
          </div>
        </FormField>

        {/* Last Name */}
        <FormField 
          label="Last Name" 
          error={errors.last_name} 
          touched={touched.last_name} 
          required
        >
          <div className="relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
              <UsersRound className="h-4 w-4 sm:h-6 sm:w-6" />
            </span>
            <Input
              id="last_name"
              name="last_name"
              type="text"
              value={values.last_name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your last name"
              className="pl-12 h-14 sm:h-16 md:h-18 text-neutral-50 sm:text-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all w-full"
            />
          </div>
        </FormField>
      </div>

      {/* Continue Button */}
      <Button
        type="button"
        onClick={onNext}
        disabled={!isValid}
        className={`w-full h-13 sm:h-12 md:h-13 text-sm sm:text-base font-semibold rounded-xl transition-all duration-200 transform shadow-lg mt-6 sm:mt-8
          ${isValid
            ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
      >
        <span className="flex items-center justify-center">
          <p className="text-lg">
            Continue to Credentials
          </p>
          <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
        </span>
      </Button>
    </div>
  );
};

export default StepOne;
