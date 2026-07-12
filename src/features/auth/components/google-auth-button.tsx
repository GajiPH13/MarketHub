"use client";

import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth/auth-client";

interface GoogleAuthButtonProps {
  mode: "signin" | "signup";
}

export function GoogleAuthButton({
  mode,
}: GoogleAuthButtonProps) {
  const [isPending, setIsPending] = useState(false);

  async function handleGoogleAuth(): Promise<void> {
    setIsPending(true);

    const result = await authClient.signIn.social({
      provider: "google",
      callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/customer`,
      errorCallbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/auth/error`,
    });

    if (result.error) {
      toast.error(
        result.error.message ??
          "Google authentication failed.",
      );

      setIsPending(false);
    }
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleGoogleAuth}
      className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-neutral-300 bg-white px-4 font-medium transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
    >
      {isPending ? (
        <LoaderCircle
          aria-hidden="true"
          className="animate-spin"
          size={18}
        />
      ) : (
        <GoogleIcon />
      )}

      {isPending
        ? "Connecting..."
        : mode === "signup"
          ? "Sign up with Google"
          : "Continue with Google"}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M21.35 11.1H12v2.98h5.38c-.23 1.48-1.65 4.34-5.38 4.34A6.42 6.42 0 0 1 12 5.58c2.12 0 3.54.9 4.35 1.68l2.96-2.86A10.76 10.76 0 0 0 12 1.5a10.5 10.5 0 1 0 0 21c6.06 0 10.07-4.26 10.07-10.26 0-.69-.08-1.2-.17-1.71l-.55.57Z"
      />
    </svg>
  );
}