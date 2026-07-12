import { LogoutButton } from "../../../../src/components/auth/logout-button";
import { requireRole } from "@/lib/auth/server-auth";

export default async function AdminDashboardPage() {
  const { user } = await requireRole(["admin"]);

  return (
    <main className="p-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm text-neutral-500">
            Administrator account
          </p>

          <h1 className="mt-1 text-2xl font-semibold">
            Welcome, {user.name}
          </h1>

          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Manage users, sellers, products, orders, and platform
            settings.
          </p>
        </div>

        <LogoutButton />
      </div>
    </main>
  );
}