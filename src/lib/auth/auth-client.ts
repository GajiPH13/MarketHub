import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const authBaseUrl = process.env.NEXT_PUBLIC_AUTH_URL;

if (!authBaseUrl) {
  throw new Error("NEXT_PUBLIC_AUTH_URL is not configured.");
}

export const authClient = createAuthClient({
  baseURL: authBaseUrl,
  basePath: "/api/auth",

  fetchOptions: {
    credentials: "include",
  },

  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
          required: true,
          input: false,
        },
        status: {
          type: "string",
          required: true,
          input: false,
        },
        isBlocked: {
          type: "boolean",
          required: true,
          input: false,
        },
        phone: {
          type: "string",
          required: false,
          input: true,
        },
        address: {
          type: "string",
          required: false,
          input: true,
        },
        sellerProfileId: {
          type: "string",
          required: false,
          input: false,
        },
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession, getSession } =
  authClient;