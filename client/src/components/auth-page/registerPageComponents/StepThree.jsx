import { Button } from "@/components/ui/button";
import { ArrowLeft, User, ArrowRight, FileText } from "lucide-react";
import FormField from "./FormField";
import RegFormNav from "./RegFormNav";

const StepThree = ({ 
  values, 
  handleChange, 
  handleBlur, 
  errors, 
  touched, 
  setFieldValue, 
  onNext, 
  onPrevious 
}) => {
  const isValid = values.roles && !errors.roles;

  return (
    <div className="space-y-1 animate-in text-white slide-in-from-right-4 duration-300">
      
      {/* Role Selection */}
      <FormField label={<span className="text-2xl">Joining as</span>} touched={touched.roles} required>
        <div className="flex flex-col sm:flex-row gap-4">
          {[
            { value: "client", label: "Client", icon: User },
            { value: "freelancer", label: "Freelancer", icon: FileText },
          ].map(({ value, label, icon: Icon }) => {
            const active = values.roles === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFieldValue("roles", value)}
                className={`
                  flex-1 flex items-center gap-3 justify-center px-4 py-3 rounded-xl border transition-all duration-200
                  ${active
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent shadow-lg"
                    : "bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400 hover:shadow-sm"
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{label}</span>
              </button>
            );
          })}
        </div>

        {/* Reserve space for error */}
        <p className="min-h-[1.5rem] text-red-500 text-sm mt-1">
          {touched.roles && errors.roles ? errors.roles : ""}
        </p>
      </FormField>


      {/* Bio */}
      <FormField label={<span className="text-2xl">Tell us about yourself</span>} icon={FileText} error={errors.bio} touched={touched.bio}>
        <textarea
          id="bio"
          name="bio"
          value={values.bio}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Share a bit about your background, skills, or interests..."
          rows={4}
          className="w-full min-h-[200px] p-3 border border-gray-200 rounded-xl text-neutral-50 text-xl resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
        />
        {/* Reserve space for bio error */}
        <p className="min-h-[1.5rem] text-red-500 text-sm">
          {touched.bio && errors.bio ? errors.bio : ""}
        </p>
      </FormField>

      {/* Navigation Buttons */}
      <RegFormNav
          onPrevious={onPrevious}
          onNext={onNext}
          isNextDisabled={!isValid}
          nextLabel="Almost Done"
          prevLabel="Back"
        />
    </div>
  );
};

export default StepThree;
