import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { registerSchema } from "../../lib/validation/RegisterSchema";
import api from "../../lib/axios";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState, useEffect } from "react";

// Import step components
import StepProgress from "./registerPageComponents/StepProgress";
import StepOne from "./registerPageComponents/StepOne";
import StepTwo from "./registerPageComponents/StepTwo";
import StepThree from "./registerPageComponents/StepThree";
import StepFour from "./registerPageComponents/StepFour";

export default function RegisterForm({ className, ...props }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const wiaLocalRegForm = "wia-register-form";

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // Load initial values from localStorage (with expiry check)
  const getInitialValues = () => {
    const saved = localStorage.getItem(wiaLocalRegForm);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        // Check expiry
        if (Date.now() - parsed.savedAt > parsed.expiresIn) {
          localStorage.removeItem(wiaLocalRegForm);
          return emptyValues;
        }

        return {
          first_name: parsed.data.first_name || "",
          last_name: parsed.data.last_name || "",
          email: parsed.data.email || "",
          password: "",
          confirmPassword: "",
          roles: parsed.data.roles || "",
          bio: parsed.data.bio || "",
          profile_picture: parsed.data.profile_picture || "",
        };
      } catch {
        localStorage.removeItem(wiaLocalRegForm);
      }
    }
    return emptyValues;
  };

  const emptyValues = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    roles: "",
    bio: "",
    profile_picture: "",
  };

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    validateField,
    resetForm,
  } = useFormik({
    initialValues: getInitialValues(),
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = { ...values, roles: [values.roles] };
        await api.post("/auth/register", payload);
        toast.success("🎉 Welcome to WIA! Registration successful!");
        localStorage.removeItem(wiaLocalRegForm);
        resetForm();
        navigate("/verification_sent");
      } catch (error) {
        const msg = error.response?.data?.message || "Something went wrong";
        toast.error(msg);
        console.error("Register Error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Persist form values to localStorage on change (except password fields)
  const persistForm = (vals) => {
    const safeVals = { ...vals };
    delete safeVals.password;
    delete safeVals.confirmPassword;

    const payload = {
      data: safeVals,
      savedAt: Date.now(),
      expiresIn: 30 * 1000, // 30 seconds
    };

    localStorage.setItem(wiaLocalRegForm, JSON.stringify(payload));
  };

  useEffect(() => {
    if (!isSubmitting) {
      persistForm(values);
    }
  }, [values, isSubmitting]);

  // 🔹 Background check every 5s to clear expired form data
  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem(wiaLocalRegForm);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Date.now() - parsed.savedAt > parsed.expiresIn) {
          localStorage.removeItem(wiaLocalRegForm);
          resetForm(); // clear UI as well
          console.log("⏳ Register form data expired and cleared!");
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [resetForm]);

  const handleNextStep = async () => {
    const currentStepFields = {
      1: ["first_name", "last_name"],
      2: ["email", "password"],
      3: ["roles", "bio"],
      4: ["profile_picture"],
    };

    let hasErrors = false;
    const fieldsToValidate = currentStepFields[step];

    await Promise.all(fieldsToValidate.map((field) => validateField(field)));

    for (const field of fieldsToValidate) {
      if (errors[field]) {
        hasErrors = true;
      }
    }

    if (!hasErrors) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const renderStepContent = () => {
    const commonProps = {
      values,
      handleChange,
      handleBlur,
      errors,
      touched,
      setFieldValue,
    };

    const steps = [
      <StepOne {...commonProps} onNext={handleNextStep} />,
      <StepTwo {...commonProps} onNext={handleNextStep} onPrevious={handlePrevStep} />,
      <StepThree {...commonProps} onNext={handleNextStep} onPrevious={handlePrevStep} />,
      <StepFour {...commonProps} isSubmitting={isSubmitting} onPrevious={handlePrevStep} />,
    ];

    return steps[step - 1];
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-1 w-full min-h-screen p-4 sm:p-6 md:p-8",
        className
      )}
      {...props}
    >
      <Card className="w-full max-w-2xl mx-auto shadow-xl border-0 bg-black/10 backdrop-blur-sm">
        <CardHeader className="pb-4 sm:pb-6 pt-6 sm:pt-8 px-4 sm:px-6 md:px-8">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Join WIA
          </CardTitle>
          <p className="text-center text-gray-500 text-xs sm:text-sm mt-2 px-2">
            Create your account in just a few steps
          </p>
          <div className="mt-4">
            <StepProgress currentStep={step} totalSteps={3} />
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
          <form onSubmit={handleSubmit}>{renderStepContent()}</form>
        </CardContent>
        <div className="flex justify-center underline hover:text-blue-600">
          <Link className="text-white text-lg" to={"/login"}>
            Already have an account? Log in
          </Link>
        </div>
      </Card>

      <div className="text-center text-xs text-gray-500 max-w-lg mx-auto px-4 mt-4">
        By creating an account, you agree to our{" "}
        <a
          href="#"
          className="text-blue-600 hover:text-blue-700 underline font-medium transition-colors"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="text-blue-600 hover:text-blue-700 underline font-medium transition-colors"
        >
          Privacy Policy
        </a>
      </div>
    </div>
  );
}
