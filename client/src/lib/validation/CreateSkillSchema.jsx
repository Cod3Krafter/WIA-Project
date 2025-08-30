import * as yup from "yup";

export const createSkillSchema = yup.object().shape({
  skill_name: yup
    .string()
    .trim()
    .required("Skill name is required")
    .min(2, "Skill name must be at least 2 characters")
    .max(100, "Skill name must be less than 100 characters"),
  description: yup
    .string()
    .trim()
    .max(500, "Description must be less than 500 characters"),
});
