import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import {
  getDashboardPath,
  getServerAuth,
} from "@/lib/auth/server-auth";

interface LoginLayoutProps {
  children: ReactNode;
}

export default async function LoginLayout({
  children,
}: LoginLayoutProps) {
  const auth = await getServerAuth();

  if (auth) {
    redirect(getDashboardPath(auth.user.role));
  }

  return children;
}