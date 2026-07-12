
import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import type {
  AuthenticatedUser,
  AuthSession,
  CurrentUserResponse,
  UserRole,
} from "@/types/auth.types";

const API_URL = process.env.API_URL;

function getApiUrl(): string {
  if (!API_URL) {
    throw new Error(
      "API_URL is not configured in the frontend environment.",
    );
  }

  return API_URL;
}

export interface ServerAuth {
  user: AuthenticatedUser;
  session: AuthSession;
}

/**
 * Retrieves the current authenticated user from the Express API.
 */
export const getServerAuth = cache(
  async (): Promise<ServerAuth | null> => {
    const incomingHeaders = await headers();
    const cookieHeader = incomingHeaders.get("cookie");

    if (!cookieHeader) {
      return null;
    }

    try {
      const response = await fetch(
        `${getApiUrl()}/users/me`,
        {
          method: "GET",
          headers: {
            cookie: cookieHeader,
            accept: "application/json",
          },
          cache: "no-store",
        },
      );

      if (response.status === 401) {
        return null;
      }

      if (response.status === 403) {
        const errorResponse = (await response.json()) as {
          code?: string;
          message?: string;
        };

        if (errorResponse.code === "ACCOUNT_BLOCKED") {
          redirect("/account-blocked");
        }

        if (errorResponse.code === "ACCOUNT_SUSPENDED") {
          redirect("/account-suspended");
        }

        console.error(
          "Current-user API rejected access:",
          errorResponse,
        );

        return null;
      }

      if (!response.ok) {
        const responseBody = await response.text();

        console.error(
          "Current-user API returned an error:",
          response.status,
          responseBody,
        );

        return null;
      }

      const result =
        (await response.json()) as CurrentUserResponse;

      const user = result.data?.user;
      const session = result.data?.session;

      if (!user || !session) {
        console.error(
          "Invalid current-user API response:",
          result,
        );

        return null;
      }

      if (
        user.role !== "customer" &&
        user.role !== "seller" &&
        user.role !== "admin"
      ) {
        console.error(
          "Invalid or missing user role:",
          user.role,
        );

        redirect("/auth/error?error=missing_role");
      }

      return {
        user,
        session,
      };
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }

      console.error(
        "Unable to retrieve the authenticated user:",
        error,
      );

      return null;
    }
  },
);

/**
 * Requires any authenticated and active MarketHub account.
 */
export async function requireAuthenticatedUser(): Promise<ServerAuth> {
  const auth = await getServerAuth();

  if (!auth) {
    redirect("/login");
  }

  return auth;
}

/**
 * Requires one of the specified user roles.
 */
export async function requireRole(
  allowedRoles: readonly UserRole[],
): Promise<ServerAuth> {
  const auth = await requireAuthenticatedUser();

  const normalizedRole = String(auth.user.role)
    .trim()
    .toLowerCase();

  if (
    normalizedRole !== "customer" &&
    normalizedRole !== "seller" &&
    normalizedRole !== "admin"
  ) {
    console.error(
      "Invalid authenticated user role:",
      auth.user.role,
    );

    redirect("/auth/error?error=missing_role");
  }

  const role = normalizedRole as UserRole;

  

  if (!allowedRoles.includes(role)) {
    const destination = getDashboardPath(role);

    console.error("Role access rejected:", {
      role,
      allowedRoles,
      destination,
    });

    redirect(destination);
  }

  return {
    ...auth,
    user: {
      ...auth.user,
      role,
    },
  };
}

/**
 * Returns the correct dashboard path for a role.
 */
export function getDashboardPath(
  role: UserRole,
): string {
  switch (role) {
    case "admin":
      return "/dashboard/admin";

    case "seller":
      return "/dashboard/seller";

    case "customer":
      return "/dashboard/customer";

    default:
      return "/auth/error?error=missing_role";
  }
}
