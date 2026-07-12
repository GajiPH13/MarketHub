import { redirect } from "next/navigation";

import {
  getDashboardPath,
  requireAuthenticatedUser,
} from "@/lib/auth/server-auth";

export default async function DashboardPage() {
  const { user } = await requireAuthenticatedUser();

  redirect(getDashboardPath(user.role));
}