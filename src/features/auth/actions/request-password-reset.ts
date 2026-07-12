import { authClient } from "@/lib/auth/auth-client";

import type { ForgotPasswordFormValues } from "../schemas/auth.schema";

export async function requestUserPasswordReset(
  values: ForgotPasswordFormValues,
): Promise<void> {
  const result = await authClient.requestPasswordReset({
    email: values.email,
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (result.error) {
    throw new Error(
      result.error.message ??
        "Unable to process the password reset request.",
    );
  }
}