import * as Yup from 'yup';

export const registerSchema = Yup.object().shape({
  first_name: Yup.string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .required("First name is required"),
    
  last_name: Yup.string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .required("Last name is required"),
    
  email: Yup.string()
    .trim()
    .email("Please enter a valid email address")
    .max(100, "Email must not exceed 100 characters")
    .required("Email is required"),
    
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .required("Password is required"),
    
  roles: Yup.array()
  .of(Yup.string().oneOf(['client', 'freelancer']))
  .min(1, "Select at least one role")
  .required("Role is required"),

    
  bio: Yup.string()
    .trim()
    .max(500, "Bio must not exceed 500 characters")
    .optional(),
    
  profile_picture: Yup.string()
    .trim()
    .url("Please enter a valid URL")
    .max(500, "URL must not exceed 500 characters")
    .optional()
    .nullable()
    .transform((value) => value === '' ? null : value),
});