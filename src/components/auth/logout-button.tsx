"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth/auth-client";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    setIsPending(true);

    const result = await authClient.signOut();

    if (result.error) {
      setIsPending(false);
      return;
    }

    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleLogout}
    >
      {isPending ? "Signing out..." : "Sign out"}
    </button>
  );
}