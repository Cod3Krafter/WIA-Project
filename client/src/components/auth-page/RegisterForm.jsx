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
    setFieldValue,
  } = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      roles: [],
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
        const msg = error.response?.data?.message || "Something went wrong";
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
            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="first_name">First Name</Label>
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
                {touched.first_name && errors.first_name && (
                  <div className="text-xs text-red-500 mt-1">{errors.first_name}</div>
                )}
              </div>

              <div>
                <Label htmlFor="last_name">Last Name</Label>
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
                {touched.last_name && errors.last_name && (
                  <div className="text-xs text-red-500 mt-1">{errors.last_name}</div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="mt-4">
              <Label htmlFor="email">Email</Label>
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
              {touched.email && errors.email && (
                <div className="text-xs text-red-500 mt-1">{errors.email}</div>
              )}
            </div>

            {/* Password */}
            <div className="mt-4">
              <Label htmlFor="password">Password</Label>
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
              {touched.password && errors.password && (
                <div className="text-xs text-red-500 mt-1">{errors.password}</div>
              )}
            </div>

            {/* Role */}
             <div className="mt-4">
                <Label>Roles</Label>
                <div className="flex gap-4">
                  {["client", "freelancer"].map((role) => (
                    <label key={role} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="roles"
                        value={role}
                        checked={values.roles.includes(role)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const newRoles = checked
                            ? [...values.roles, role]
                            : values.roles.filter((r) => r !== role);
                          setFieldValue("roles", newRoles);
                        }}
                      />
                      <span className="text-sm capitalize">{role}</span>
                    </label>
                  ))}
                </div>
                {touched.roles && errors.roles && (
                  <div className="text-xs text-red-500 mt-1">{errors.roles}</div>
                )}
      </div>


            {/* Bio */}
            <div className="mt-4">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                name="bio"
                value={values.bio}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Tell us about yourself..."
                className="textarea textarea-bordered border border-gray-300 w-full text-sm min-h-[60px] resize-none bg-white"
              />
              {touched.bio && errors.bio && (
                <div className="text-xs text-red-500 mt-1">{errors.bio}</div>
              )}
            </div>

            {/* Profile Picture */}
            <div className="mt-4">
              <Label htmlFor="profile_picture">Profile Picture URL</Label>
              <Input
                id="profile_picture"
                name="profile_picture"
                type="text"
                value={values.profile_picture}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="https://example.com/photo.jpg"
                className="h-9 text-sm"
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
          </form>
        </CardContent>
      </Card>

      <p className="text-muted-foreground text-center text-xs max-w-md mx-auto mt-2">
        By clicking register, you agree to our{" "}
        <a href="#" className="underline hover:text-primary">Terms of Service</a>{" "}
        and{" "}
        <a href="#" className="underline hover:text-primary">Privacy Policy</a>.
      </p>
    </div>
  );
}
