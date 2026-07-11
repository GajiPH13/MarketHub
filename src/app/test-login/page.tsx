"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth/auth-client";

export default function TestLoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setMessage("Signing in...");

    const formData = new FormData(event.currentTarget);

    const result = await authClient.signIn.email({
      email: String(formData.get("email")),
      password: String(formData.get("password")),
      rememberMe: true,
    });

    if (result.error) {
      setMessage(
        result.error.message ?? "Login failed.",
      );

      return;
    }

    setMessage("Login successful.");
    router.push("/");
    router.refresh();
  }

  return (
    <main>
      <h1>Test login</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input name="email" type="email" required />
        </label>

        <label>
          Password
          <input name="password" type="password" required />
        </label>

        <button type="submit">Sign in</button>
      </form>

      <p>{message}</p>
    </main>
  );
}