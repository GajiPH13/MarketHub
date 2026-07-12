import { z } from "zod";

export const sellerApplicationSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(3, "Business name must be at least 3 characters.")
    .max(100, "Business name must be at most 100 characters."),

  businessEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid business email."),

  businessPhone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number.")
    .max(30, "Phone number is too long."),

  businessAddress: z
    .string()
    .trim()
    .min(10, "Business address must be at least 10 characters.")
    .max(300, "Business address is too long."),

  sellerBio: z
    .string()
    .trim()
    .min(20, "Seller bio must be at least 20 characters.")
    .max(1000, "Seller bio is too long."),

  categoryFocus: z
    .array(z.string().trim().min(1))
    .min(1, "Select at least one category."),

  logoUrl: z
    .string()
    .url("Enter a valid logo URL.")
    .optional()
    .or(z.literal("")),

  documentUrl: z
    .string()
    .url("Enter a valid document URL.")
    .optional()
    .or(z.literal("")),
});

export type SellerApplicationFormValues = z.infer<
  typeof sellerApplicationSchema
>;