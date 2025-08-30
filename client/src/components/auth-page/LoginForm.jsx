import { useAuth } from '../../context/useAuth'
import { useFormik } from 'formik';
import { useNavigate } from "react-router-dom";
import { loginSchema } from '../../lib/validation/LoginSchema';
import PasswordInput from '../ui/PasswordInput';
import api from '../../lib/axios';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight } from "lucide-react";
import toast from 'react-hot-toast';

export function LoginForm({ className, ...props }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const { values, handleChange, handleBlur, handleSubmit, errors, touched, isSubmitting } = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const res = await api.post("/auth/login", values, { withCredentials: true });
        login(res.data.accessToken);
        toast.success("Login successful!");
        navigate("/");
        resetForm();
      } catch (error) {
        const message = error.response?.data?.message || error.message;
        toast.error(message.includes("Invalid") ? "Invalid email or password" : "Something went wrong");
      } finally { setSubmitting(false); }
    }
  });

  const isValid = values.email && values.password && !errors.email && !errors.password;

  return (
    <div className={cn("flex flex-col gap-4 w-full min-h-screen p-4 sm:p-6 md:p-8", className)} {...props}>
      <Card className="w-full max-w-2xl mx-auto shadow-xl border-0 bg-black/10 backdrop-blur-sm animate-in slide-in-from-right-4 duration-300">
        <CardHeader className="pb-6 sm:pb-8 pt-6 sm:pt-8 px-4 sm:px-6 md:px-8">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-in fade-in-10 duration-500">
            Welcome Back to WIA
          </CardTitle>
          <p className="text-center text-gray-400 mt-2 animate-in fade-in-20 duration-500 delay-100">
            Sign in to your account
          </p>
        </CardHeader>

        <CardContent className="space-y-6 animate-in fade-in-30 duration-500 delay-200">
          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col justify-center">
            {/* Email Field */}
            <div className="space-y-3 animate-in slide-in-from-right-4 duration-300">
              <Label htmlFor="email" className="text-md font-medium text-neutral-50 flex items-center gap-2">
                <Mail className="size-4 text-blue-500" />
                Email Address
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full sm:w-11/12 mx-auto h-14 sm:h-16 md:h-18 text-neutral-50 sm:text-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all "
              />
              <div className="min-h-6 w-11/12 mx-auto">
                {touched.email && errors.email && <p className="text-md text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-3 animate-in slide-in-from-right-4 duration-300">
              <Label htmlFor="password" className="text-md font-medium text-neutral-50 flex items-center gap-2">
                <Lock className="size-4 text-blue-500" />
                Password
                <span className="text-red-500">*</span>
              </Label>
              <PasswordInput
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                touched={touched.password}
                error={errors.password}
                placeholder="Enter your password"
                className="h-14 sm:h-16 md:h-18 text-neutral-50 sm:text-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={`w-11/12 mx-auto h-13 sm:h-12 md:h-13 sm:text-base font-semibold rounded-xl transition-all duration-200 transform shadow-lg mt-6
                ${isValid && !isSubmitting
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              <span className="flex items-center justify-center">
                <p className='text-lg'>
                  Sign In
                </p>
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </span>
            </Button>

            {/* Additional Link */}
            <div className="pt-4 text-center animate-in fade-in-50 duration-500 delay-300">
              <a href="/register" className="text-lg text-blue-600 hover:text-blue-800 transition-colors duration-200">
                Don't have an account? Register here
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
