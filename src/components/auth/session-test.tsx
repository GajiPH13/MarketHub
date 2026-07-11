"use client";

import { authClient } from "@/lib/auth/auth-client";

export function SessionTest() {
  const {
    data: session,
    isPending,
    error,
  } = authClient.useSession();

  if (isPending) {
    return <p>Checking session...</p>;
  }

  if (error) {
    return <p>Unable to retrieve the session.</p>;
  }

  if (!session) {
    return <p>You are not signed in.</p>;
  }

  return (
    <section>
      <h2>Authenticated user</h2>

      <p>Name: {session.user.name}</p>
      <p>Email: {session.user.email}</p>
      <p>User ID: {session.user.id}</p>
    </section>
  );
}