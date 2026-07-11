import type { SignUpFormValues } from "../schemas/auth.schema";
import { authClient } from "@/lib/auth/auth-client";

export async function signUpWithEmail(
  input: SignUpFormValues,
) {
  const result = await authClient.signUp.email({
    name: input.name,
    email: input.email,
    password: input.password,
    callbackURL: "/dashboard/customer",
  });

  if (result.error) {
    throw new Error(
      result.error.message ?? "Unable to create your account.",
    );
  }

  return result.data;
}