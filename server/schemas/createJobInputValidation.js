import * as yup from 'yup'

export const createJobSchema = yup.object({
  title: yup
    .string()
    .min(5, "Title must be at least 5 characters")
    .required("Title is required"),

  description: yup
    .string()
    .min(20, "Description must be at least 20 characters")
    .required("Description is required"),

  budget: yup
    .number()
    .positive("Budget must be a positive number")
    .required("Budget is required"),

  category: yup
    .string()
    .min(3, "Category must be at least 3 characters")
    .required("Category is required"),

  deadline: yup
    .date()
    .min(new Date(), "Deadline must be a future date")
    .required("Deadline is required")
})
