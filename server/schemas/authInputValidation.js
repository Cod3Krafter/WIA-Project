// validations/userValidation.js
import * as yup from 'yup'

export const registerUserSchema = yup.object({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  role: yup.string().oneOf(['client', 'freelancer'], "Invalid role").required("Role is required"),
  bio: yup.string().optional(),
  profile_picture: yup.string().url("Profile picture must be a valid URL").optional(),
})

export const getUserSchema = yup.object({
  id: yup
    .number()
    .positive()
    .integer()
    .required("User ID is required")
})

export const loginUserSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
})

