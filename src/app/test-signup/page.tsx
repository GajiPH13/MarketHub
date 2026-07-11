"use client";

import { FormEvent, useState } from "react";

import { authClient } from "@/lib/auth/auth-client";

export default function TestSignupPage() {
  const [message, setMessage] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setMessage("Creating account...");

    const formData = new FormData(event.currentTarget);

    const result = await authClient.signUp.email({
      name: String(formData.get("name")),
      email: String(formData.get("email")),
      password: String(formData.get("password")),
      callbackURL: "/",
    });

    if (result.error) {
      setMessage(
        result.error.message ?? "Registration failed.",
      );

      return;
    }

    setMessage("Registration successful.");
  }

  return (
    <main>
      <h1>Test registration</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" required />
        </label>

        <label>
          Email
          <input name="email" type="email" required />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            minLength={8}
            required
          />
        </label>

        <button type="submit">Create account</button>
      </form>

      <p>{message}</p>
    </main>
  );
}