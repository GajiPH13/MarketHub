import { authClient } from "@/lib/auth/auth-client";

export async function signOutUser(): Promise<void> {
  const result = await authClient.signOut();

  if (result.error) {
    throw new Error(
      result.error.message ?? "Unable to sign out.",
    );
  }
}