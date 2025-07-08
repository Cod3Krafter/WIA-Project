import * as yup from 'yup'

export const applyToJobSchema = yup.object({
  job_id: yup
    .number()
    .positive("Invalid job ID")
    .integer("Job ID must be an integer")
    .required("Job ID is required"),

  proposal: yup
    .string()
    .min(10, "Proposal must be at least 10 characters")
    .required("Proposal is required"),

  expected_budget: yup
    .number()
    .positive("Expected budget must be a positive number")
    .required("Expected budget is required"),

  freelancer_contact: yup
    .string()
    .min(5, "Contact info must be at least 5 characters")
    .required("Freelancer contact is required"),
})
