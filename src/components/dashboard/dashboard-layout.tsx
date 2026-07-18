import type {
  ReactNode,
} from "react";

interface DashboardLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function DashboardLayout({
  sidebar,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      {sidebar}

      <div className="lg:pl-72">
        <main className="mx-auto min-h-screen max-w-7xl px-4 pb-10 pt-20 sm:px-6 lg:px-8 lg:pt-10">
          {children}
        </main>
      </div>
    </div>
  );
}