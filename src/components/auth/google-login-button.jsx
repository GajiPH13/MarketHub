"use client";

import { authClient } from "@/lib/auth/auth-client";

export function GoogleLoginButton() {
  async function handleGoogleLogin() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "http://localhost:3000/dashboard/customer",
      errorCallbackURL: "http://localhost:3000/login",
    });
  }

  return (
    <button type="button" onClick={handleGoogleLogin}>
      Continue with Google
    </button>
  );
}