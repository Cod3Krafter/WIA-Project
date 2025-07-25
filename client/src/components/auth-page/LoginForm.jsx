import {useAuth} from '../../context/useAuth'
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
import toast from 'react-hot-toast';

export function LoginForm({ className, ...props }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    isSubmitting,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const res = await api.post("/auth/login", values, {
          withCredentials: true,
        });

        const accessToken = res.data.accessToken;
        login(accessToken);

        toast.success("Login successful!");
        navigate("/");
        resetForm();
      } catch (error) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;

        if (status === 401 || /invalid credentials/i.test(message)) {
          toast.error("Invalid email or password");
        } else {
          toast.error("Something went wrong. Please try again.");
        }

        console.error("Login error:", message);
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <div className={cn("w-full max-w-md mx-auto py-10 px-4", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">WIA Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className="min-h-10 text-base"
              />
              <div className='min-h-5 '>
                {touched.email && errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <PasswordInput
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              touched={touched.password}
              error={errors.password}
            />


            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full min-h-10 text-base font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
