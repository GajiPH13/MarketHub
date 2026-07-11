import { authClient } from "../../../lib/auth/auth-client";

import type { SignInFormValues } from "../schemas/auth.schema";

export async function signInWithEmail(input: SignInFormValues) {
  const result = await authClient.signIn.email({
    email: input.email,
    password: input.password,
    rememberMe: input.rememberMe,
    callbackURL: "/dashboard/customer",
  });

  if (result.error) {
    throw new Error(
      result.error.message ?? "Invalid email or password.",
    );
  }

  return result.data;
}