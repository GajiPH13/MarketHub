import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password must be at most 128 characters.")
  .regex(/[a-z]/, "Password must contain a lowercase letter.")
  .regex(/[A-Z]/, "Password must contain an uppercase letter.")
  .regex(/[0-9]/, "Password must contain a number.");

export const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(80, "Name must be at most 80 characters."),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Enter a valid email address."),

    password: passwordSchema,

    confirmPassword: z.string(),

    acceptTerms: z.boolean().refine((value) => value, {
      message: "You must accept the terms and conditions.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address."),

  password: z.string().min(1, "Password is required."),

  rememberMe: z.boolean(),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address."),
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignUpFormInput = z.input<typeof signUpSchema>;
export type SignUpFormValues = z.output<typeof signUpSchema>;

export type SignInFormInput = z.input<typeof signInSchema>;
export type SignInFormValues = z.output<typeof signInSchema>;

export type ForgotPasswordFormValues = z.infer<
  typeof forgotPasswordSchema
>;

export type ResetPasswordFormValues = z.infer<
  typeof resetPasswordSchema
>;