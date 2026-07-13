"use client";

import {
  Check,
  LoaderCircle,
  RefreshCw,
  Store,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  approveSellerApplication,
  getAdminSellerApplications,
  rejectSellerApplication,
  type SellerApplication,
  type SellerApplicationStatus,
} from "../api/admin-seller-applications";

const STATUS_OPTIONS: Array<{
  label: string;
  value: SellerApplicationStatus;
}> = [
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Approved",
    value: "approved",
  },
  {
    label: "Rejected",
    value: "rejected",
  },
];

export function AdminSellerApplications() {
  const [status, setStatus] =
    useState<SellerApplicationStatus>("pending");

  const [applications, setApplications] = useState<
    SellerApplication[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);

  const [actionId, setActionId] = useState<
    string | null
  >(null);

  const [rejectingApplication, setRejectingApplication] =
    useState<SellerApplication | null>(null);

  const [rejectionReason, setRejectionReason] =
    useState("");

  const loadApplications = useCallback(async () => {
    try {
      setIsLoading(true);

      const data =
        await getAdminSellerApplications(status);

      setApplications(data.items);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load seller applications.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    void loadApplications();
  }, [loadApplications]);

  async function handleApprove(
    application: SellerApplication,
  ): Promise<void> {
    const confirmed = window.confirm(
      `Approve ${application.businessName} as a seller?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(application._id);

      await approveSellerApplication(application._id);

      toast.success(
        `${application.businessName} was approved.`,
      );

      await loadApplications();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to approve the application.",
      );
    } finally {
      setActionId(null);
    }
  }

  function openRejectDialog(
    application: SellerApplication,
  ): void {
    setRejectingApplication(application);
    setRejectionReason("");
  }

  function closeRejectDialog(): void {
    if (actionId) {
      return;
    }

    setRejectingApplication(null);
    setRejectionReason("");
  }

  async function handleReject(): Promise<void> {
    if (!rejectingApplication) {
      return;
    }

    const normalizedReason = rejectionReason.trim();

    if (normalizedReason.length < 5) {
      toast.error(
        "The rejection reason must be at least 5 characters.",
      );

      return;
    }

    try {
      setActionId(rejectingApplication._id);

      await rejectSellerApplication(
        rejectingApplication._id,
        normalizedReason,
      );

      toast.success(
        `${rejectingApplication.businessName} was rejected.`,
      );

      setRejectingApplication(null);
      setRejectionReason("");

      await loadApplications();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to reject the application.",
      );
    } finally {
      setActionId(null);
    }
  }

  return (
    <>
      <section>
        <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500">
              Seller management
            </p>

            <h1 className="mt-1 text-3xl font-semibold">
              Seller applications
            </h1>

            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              Review applications and manage seller access.
            </p>
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => void loadApplications()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 text-sm font-medium transition hover:bg-neutral-100 disabled:opacity-60 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            <RefreshCw
              aria-hidden="true"
              size={16}
              className={
                isLoading ? "animate-spin" : undefined
              }
            />

            Refresh
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((option) => {
            const isActive = option.value === status;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatus(option.value)}
                className={
                  isActive
                    ? "rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
                    : "rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                }
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex min-h-60 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800">
              <LoaderCircle
                aria-hidden="true"
                className="animate-spin"
                size={28}
              />
            </div>
          ) : applications.length === 0 ? (
            <div className="flex min-h-60 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 px-6 text-center dark:border-neutral-700">
              <Store
                aria-hidden="true"
                size={36}
                className="text-neutral-400"
              />

              <h2 className="mt-4 text-lg font-semibold">
                No {status} applications
              </h2>

              <p className="mt-2 text-sm text-neutral-500">
                Applications with this status will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {applications.map((application) => (
                <SellerApplicationCard
                  key={application._id}
                  application={application}
                  actionId={actionId}
                  onApprove={handleApprove}
                  onReject={openRejectDialog}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {rejectingApplication && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onMouseDown={closeRejectDialog}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="reject-dialog-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2
              id="reject-dialog-title"
              className="text-xl font-semibold"
            >
              Reject seller application
            </h2>

            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Explain why the application from{" "}
              <strong>
                {rejectingApplication.businessName}
              </strong>{" "}
              is being rejected.
            </p>

            <label
              htmlFor="rejectionReason"
              className="mt-5 block text-sm font-medium"
            >
              Rejection reason
            </label>

            <textarea
              id="rejectionReason"
              rows={5}
              value={rejectionReason}
              onChange={(event) =>
                setRejectionReason(event.target.value)
              }
              placeholder="Provide a clear reason for the applicant."
              className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-950"
            />

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={Boolean(actionId)}
                onClick={closeRejectDialog}
                className="h-10 rounded-lg border border-neutral-300 px-4 text-sm font-medium dark:border-neutral-700"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={Boolean(actionId)}
                onClick={() => void handleReject()}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {actionId ? (
                  <LoaderCircle
                    aria-hidden="true"
                    className="animate-spin"
                    size={16}
                  />
                ) : (
                  <X aria-hidden="true" size={16} />
                )}

                Reject application
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

interface SellerApplicationCardProps {
  application: SellerApplication;
  actionId: string | null;
  onApprove: (
    application: SellerApplication,
  ) => Promise<void>;
  onReject: (
    application: SellerApplication,
  ) => void;
}

function SellerApplicationCard({
  application,
  actionId,
  onApprove,
  onReject,
}: SellerApplicationCardProps) {
  const isPendingAction =
    actionId === application._id;

  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-semibold">
              {application.businessName}
            </h2>

            <StatusBadge status={application.status} />
          </div>

          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            {application.businessEmail}
          </p>

          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            {application.businessPhone}
          </p>

          <p className="mt-4 leading-7 text-neutral-700 dark:text-neutral-300">
            {application.sellerBio}
          </p>

          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Business address
              </dt>

              <dd className="mt-1 text-sm">
                {application.businessAddress}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Submitted
              </dt>

              <dd className="mt-1 text-sm">
                {formatDate(application.createdAt)}
              </dd>
            </div>
          </dl>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Categories
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {application.categoryFocus.map(
                (category) => (
                  <span
                    key={category}
                    className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium capitalize dark:bg-neutral-800"
                  >
                    {category}
                  </span>
                ),
              )}
            </div>
          </div>

          {application.logoUrl && (
            <a
              href={application.logoUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-block text-sm font-medium underline"
            >
              View store logo
            </a>
          )}

          {application.documentUrl && (
            <a
              href={application.documentUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 ml-4 inline-block text-sm font-medium underline"
            >
              View business document
            </a>
          )}

          {application.rejectionReason && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
              <p className="text-xs font-semibold uppercase tracking-wide text-red-700 dark:text-red-400">
                Rejection reason
              </p>

              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                {application.rejectionReason}
              </p>
            </div>
          )}
        </div>

        {application.status === "pending" && (
          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              disabled={Boolean(actionId)}
              onClick={() =>
                void onApprove(application)
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
            >
              {isPendingAction ? (
                <LoaderCircle
                  aria-hidden="true"
                  className="animate-spin"
                  size={16}
                />
              ) : (
                <Check
                  aria-hidden="true"
                  size={16}
                />
              )}

              Approve
            </button>

            <button
              type="button"
              disabled={Boolean(actionId)}
              onClick={() => onReject(application)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-300 px-4 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <X aria-hidden="true" size={16} />
              Reject
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function StatusBadge({
  status,
}: {
  status: SellerApplicationStatus;
}) {
  const classes = {
    pending:
      "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    approved:
      "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
    rejected:
      "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${classes[status]}`}
    >
      {status}
    </span>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}