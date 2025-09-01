import * as Yup from 'yup';

export const contactMethodSchema = Yup.object({
  whatsapp: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, "Invalid WhatsApp number")
    .optional(),

  email: Yup.string()
    .email("Invalid email address")
    .optional(),

  linkedin: Yup.string()
    .url("Must be a valid LinkedIn URL")
    .matches(
      /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/i,
      "Invalid LinkedIn URL"
    )
    .optional(),
});
