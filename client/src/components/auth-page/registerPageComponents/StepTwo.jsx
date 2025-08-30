import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Mail, Lock } from "lucide-react";
import FormField from "./FormField";
import RegFormNav from "./RegFormNav";

const StepTwo = ({ 
  values, 
  handleChange, 
  handleBlur, 
  errors, 
  touched, 
  onNext, 
  onPrevious
}) => {
  const isValid =
    values.email &&
    values.password &&
    values.confirmPassword &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword;

  return (
    <div className="space-y-2 sm:space-y-6 animate-in text-white slide-in-from-right-4 duration-300">
      {/* Email */}
      <FormField error={errors.email} touched={touched.email} required>
        <div className="relative w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
            <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
          <Input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your email address"
            className="pl-12 h-14 sm:h-16 md:h-18 text-neutral-50 sm:text-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all w-full"
          />
        </div>
      </FormField>

      {/* Password */}
      <FormField error={errors.password} touched={touched.password} required>
        <div className="relative w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
            <Lock className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
          <Input
            id="password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Create a secure password"
            className="pl-12 h-14 sm:h-16 md:h-18 text-neutral-50 sm:text-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all w-full"
          />
        </div>
      </FormField>

      {/* Confirm Password */}
      <FormField error={errors.confirmPassword} touched={touched.confirmPassword} required>
        <div className="relative w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
            <Lock className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Re-enter your password"
            className="pl-12 h-14 sm:h-16 md:h-18 text-neutral-50 sm:text-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all w-full"
          />
        </div>
      </FormField>

      {/* Navigation Buttons */}
      <RegFormNav
        onPrevious={onPrevious}
        onNext={onNext}
        isNextDisabled={!isValid}
        nextLabel="Continue to Profile"
        prevLabel="Back"
      />
    </div>
  );
};

export default StepTwo;
