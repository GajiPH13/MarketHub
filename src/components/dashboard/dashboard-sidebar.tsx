"use client";

import type {
  LucideIcon,
} from "lucide-react";
import {
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  usePathname,
} from "next/navigation";
import type {
  ReactNode,
} from "react";
import {
  useState,
} from "react";

interface DashboardNavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface DashboardSidebarProps {
  title: string;
  subtitle?: string;
  navigationItems:
    DashboardNavigationItem[];
  dashboardHomeHref: string;
  footer?: ReactNode;
}

export function DashboardSidebar({
  title,
  subtitle,
  navigationItems,
  dashboardHomeHref,
  footer,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const [isOpen, setIsOpen] =
    useState(false);

  function closeSidebar(): void {
    setIsOpen(false);
  }

  function isNavigationItemActive(
    href: string,
  ): boolean {
    if (href === dashboardHomeHref) {
      return pathname === href;
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  return (
    <>
      <button
        type="button"
        aria-label="Open dashboard navigation"
        aria-expanded={isOpen}
        onClick={() =>
          setIsOpen(true)
        }
        className="fixed left-4 top-4 z-40 inline-flex size-10 items-center justify-center rounded-lg border border-neutral-300 bg-white shadow-sm lg:hidden dark:border-neutral-700 dark:bg-neutral-900"
      >
        <Menu
          aria-hidden={true}
          size={20}
        />
      </button>

      {isOpen && (
        <button
          type="button"
          aria-label="Close dashboard navigation"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-neutral-200 bg-white transition-transform duration-200 dark:border-neutral-800 dark:bg-neutral-950 lg:translate-x-0 ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex min-h-20 items-center justify-between border-b border-neutral-200 px-6 dark:border-neutral-800">
          <Link
            href={dashboardHomeHref}
            onClick={closeSidebar}
            className="min-w-0"
          >
            <p className="truncate text-lg font-semibold">
              {title}
            </p>

            {subtitle && (
              <p className="mt-0.5 truncate text-xs text-neutral-500">
                {subtitle}
              </p>
            )}
          </Link>

          <button
            type="button"
            aria-label="Close dashboard navigation"
            onClick={closeSidebar}
            className="inline-flex size-9 items-center justify-center rounded-lg hover:bg-neutral-100 lg:hidden dark:hover:bg-neutral-900"
          >
            <X
              aria-hidden={true}
              size={19}
            />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navigationItems.map(
              (item) => {
                const Icon = item.icon;

                const isActive =
                  isNavigationItemActive(
                    item.href,
                  );

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeSidebar}
                      className={
                        isActive
                          ? "flex items-center gap-3 rounded-lg bg-neutral-900 px-3 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
                          : "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900"
                      }
                    >
                      <Icon
                        aria-hidden={true}
                        size={18}
                      />

                      <span>
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              },
            )}
          </ul>
        </nav>

        {footer && (
          <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
            {footer}
          </div>
        )}
      </aside>
    </>
  );
}

export type {
  DashboardNavigationItem,
};