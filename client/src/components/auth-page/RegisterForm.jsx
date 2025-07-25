import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function RegisterForm({ className, ...props }) {
  const navigate = useNavigate();

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
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      role: "",
      bio: "",
      profile_picture: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const res = await api.post("/auth/register", values);
        toast.success("Registration successful!");
        resetForm();
        navigate("/login");
      } catch (error) {
        const msg =
          error.response?.data?.message || "Something went wrong";
        toast.error(msg);
        console.error("Register Error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-1", className)} {...props}>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-sans text-center">WIA Register</CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <form onSubmit={handleSubmit}>
            <div className="">
              
              {/* Name Fields - Side by Side */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="first_name" className="text-sm font-medium">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    type="text"
                    value={values.first_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className="h-9 text-sm"
                  />
                  <div className="h-5 mt-1">
                    {touched.first_name && errors.first_name && (
                      <div className="text-xs text-red-500">{errors.first_name}</div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="last_name" className="text-sm font-medium">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    type="text"
                    value={values.last_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className="h-9 text-sm"
                  />
                  <div className="h-5 mt-1">
                    {touched.last_name && errors.last_name && (
                      <div className="text-xs text-red-500">{errors.last_name}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className="h-9 text-sm"
                />
                <div className="h-5 mt-1">
                  {touched.email && errors.email && (
                    <div className="text-xs text-red-500">{errors.email}</div>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className="h-9 text-sm"
                />
                <div className="h-5 mt-1">
                  {touched.password && errors.password && (
                    <div className="text-xs text-red-500">{errors.password}</div>
                  )}
                </div>
              </div>

              {/* Role Dropdown */}
              <div>
                <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                <select
                  id="role"
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className="select select-bordered border border-gray-300 w-full h-9 text-sm min-h-9 bg-white"
                >
                  <option value="">Select a role</option>
                  <option value="client">Client</option>
                  <option value="freelancer">Freelancer</option>
                </select>
                {touched.role && errors.role && (
                  <div className="text-xs text-red-500 mt-1">{errors.role}</div>
                )}
              </div>

              {/* Bio */}
              <div className="rounded p-3">
                    <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={values.bio}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="textarea textarea-bordered border border-gray-300 w-full text-sm min-h-[60px] resize-none bg-white"
                        placeholder="Tell us about yourself..."
                    />
                    {touched.bio && errors.bio && (
                        <div className="text-xs text-red-500 mt-1">{errors.bio}</div>
                    )}
                </div>


              {/* Profile Picture URL */}
              <div>
                <Label htmlFor="profile_picture" className="text-sm font-medium">Profile Picture URL</Label>
                <Input
                  id="profile_picture"
                  name="profile_picture"
                  type="text"
                  value={values.profile_picture}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="h-9 text-sm"
                  placeholder="https://example.com/image.jpg"
                />
                {touched.profile_picture && errors.profile_picture && (
                  <div className="text-xs text-red-500 mt-1">{errors.profile_picture}</div>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-10 text-sm font-medium mt-6" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </Button>

            </div>
          </form>
        </CardContent>
      </Card>

      <div className="text-muted-foreground text-center text-xs max-w-md mx-auto">
        By clicking register, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </a>.
      </div>
    </div>
  );
}