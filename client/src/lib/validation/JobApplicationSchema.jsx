import * as Yup from "yup";

export const jobApplicationSchema = Yup.object().shape({
  proposal: Yup.string()
    .required("Proposal is required")
    .min(20, "Proposal must be at least 20 characters"),
  expected_budget: Yup.number()
    .typeError("Expected budget must be a number")
    .positive("Expected budget must be a positive number")
    .required("Expected budget is required"),
  freelancer_contact: Yup.string()
    .required("Contact info is required")
    .min(5, "Contact info is too short"),
});
