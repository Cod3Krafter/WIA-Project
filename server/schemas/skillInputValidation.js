import * as yup from 'yup'

export const createSkillSchema = yup.object({
  skill_name: yup
    .string()
    .min(2, "Skill name must be at least 2 characters")
    .required("Skill name is required"),

  description: yup
    .string()
    .min(5, "Description must be at least 5 characters")
    .optional(),
})
