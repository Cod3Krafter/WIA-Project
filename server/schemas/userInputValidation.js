import * as yup from 'yup'

export const updateUserSchema = yup.object({
  first_name: yup
    .string()
    .min(2, "First name must be at least 2 characters")
    .optional(),

  last_name: yup
    .string()
    .min(2, "Last name must be at least 2 characters")
    .optional(),

  email: yup
    .string()
    .email("Invalid email format")
    .optional(),

  bio: yup
    .string()
    .max(1000, "Bio must be under 1000 characters")
    .optional(),

  profile_picture: yup
    .string()
    .url("Profile picture must be a valid URL")
    .optional(),
})
