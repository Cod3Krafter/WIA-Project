import * as yup from 'yup'

export const createProjectSchema = yup.object({
  skill_id: yup
    .number()
    .positive("Skill ID must be a positive number")
    .integer("Skill ID must be an integer")
    .required("Skill ID is required"),

  title: yup
    .string()
    .min(5, "Title must be at least 5 characters")
    .required("Title is required"),

  description: yup
    .string()
    .min(20, "Description must be at least 20 characters")
    .required("Description is required"),

  media_url: yup
    .string()
    .url("Media URL must be a valid URL")
    .optional(),

  price_range: yup
    .string()
    .min(3, "Price range must be a valid format (e.g., '100-500')")
    .required("Price range is required"),
})


export const updateProjectSchema = yup.object({
  title: yup
    .string()
    .min(5, "Title must be at least 5 characters")
    .optional(),

  description: yup
    .string()
    .min(20, "Description must be at least 20 characters")
    .optional(),

  media_url: yup
    .string()
    .url("Media URL must be a valid URL")
    .optional(),

  price_range: yup
    .string()
    .min(3, "Price range must be a valid format (e.g., '100-500')")
    .optional()
})
