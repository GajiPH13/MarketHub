import { LogoutButton } from "@/../src/components/auth/logout-button";
// import { requireAuthenticatedUser } from "@/lib/auth/server-auth";
import { requireRole } from "@/lib/auth/server-auth";

export default async function CustomerDashboardPage() {
  // const { user } = await requireAuthenticatedUser();
  const { user } = await requireRole(["customer","seller"]);

  return (
    <main className="p-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm text-neutral-500">
            Customer account
          </p>

          <h1 className="mt-1 text-2xl font-semibold">
            Welcome, {user.name}
          </h1>
        </div>

        <LogoutButton />
      </div>
    </main>
  );
}