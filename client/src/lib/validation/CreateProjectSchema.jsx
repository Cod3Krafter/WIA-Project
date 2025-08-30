import * as Yup from "yup";

const createProjectSchema = Yup.object().shape({
  skill_id: Yup.string().required("Skill is required"),

  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .required("Title is required"),

  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),

  media_url: Yup.string()
    .url("Media URL must be a valid URL")
    .optional(),

  price_range: Yup.string()
    .matches(/^₦?[\d,]+(\s*-\s*₦?[\d,]+)?$/, "Invalid price range format")
    .required("Price range is required"),

  contact_method_id: Yup.string()
    .min(2, "Enter a valid contact method")
    .required("Contact method is required"),
});

export default createProjectSchema;
