import { authClient } from "@/lib/auth/auth-client";

import type { ResetPasswordFormValues } from "../schemas/auth.schema";

interface ResetUserPasswordInput
  extends ResetPasswordFormValues {
  token: string;
}

export async function resetUserPassword({
  password,
  token,
}: ResetUserPasswordInput): Promise<void> {
  const result = await authClient.resetPassword({
    newPassword: password,
    token,
  });

  if (result.error) {
    throw new Error(
      result.error.message ??
        "Unable to reset your password.",
    );
  }
}