"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";

import { resetUserPassword } from "@/features/auth/actions/reset-password";
import {
  resetPasswordSchema,
  type ResetPasswordFormInput,
  type ResetPasswordFormValues,
} from "@/features/auth/schemas/auth.schema";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const resetError = searchParams.get("error");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<
    ResetPasswordFormInput,
    undefined,
    ResetPasswordFormValues
  >({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<
    ResetPasswordFormValues
  > = async (values) => {
    if (!token) {
      toast.error(
        "The password reset link is invalid or has expired.",
      );

      return;
    }

    try {
      await resetUserPassword({
        ...values,
        token,
      });

      setIsComplete(true);

      toast.success("Your password has been reset.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to reset your password.",
      );
    }
  };

  if (isComplete) {
    return (
      <section className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <CheckCircle2
          aria-hidden="true"
          className="mx-auto"
          size={48}
        />

        <h1 className="mt-5 text-2xl font-semibold">
          Password updated
        </h1>

        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
          You can now sign in using your new password.
        </p>

        <button
          type="button"
          className="mt-6 h-11 rounded-lg bg-neutral-900 px-5 font-medium text-white dark:bg-white dark:text-neutral-900"
          onClick={() => router.replace("/login")}
        >
          Continue to login
        </button>
      </section>
    );
  }

  if (!token || resetError) {
    return (
      <section className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-sm font-semibold text-red-600">
          Invalid reset link
        </p>

        <h1 className="mt-3 text-2xl font-semibold">
          Request a new password reset
        </h1>

        <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          This password reset link is invalid, incomplete, or
          expired.
        </p>

        <Link
          href="/forgot-password"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-neutral-900 px-5 font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          Request another link
        </Link>
      </section>
    );
  }

  return (
    <section className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
      <header className="mb-6 text-center">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight"
        >
          MarketHub
        </Link>

        <h1 className="mt-5 text-2xl font-semibold">
          Create a new password
        </h1>

        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Choose a strong password for your MarketHub account.
        </p>
      </header>

      <form
        className="space-y-5"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium"
          >
            New password
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "password-error" : undefined
              }
              className="h-11 w-full rounded-lg border border-neutral-300 bg-transparent px-3 pr-11 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 dark:border-neutral-700 dark:focus:border-white"
              {...register("password")}
            />

            <button
              type="button"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-neutral-500"
              onClick={() =>
                setShowPassword((current) => !current)
              }
            >
              {showPassword ? (
                <EyeOff aria-hidden="true" size={18} />
              ) : (
                <Eye aria-hidden="true" size={18} />
              )}
            </button>
          </div>

          {errors.password && (
            <p
              id="password-error"
              className="mt-1.5 text-sm text-red-600"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm font-medium"
          >
            Confirm new password
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              type={
                showConfirmPassword ? "text" : "password"
              }
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={
                errors.confirmPassword
                  ? "confirm-password-error"
                  : undefined
              }
              className="h-11 w-full rounded-lg border border-neutral-300 bg-transparent px-3 pr-11 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 dark:border-neutral-700 dark:focus:border-white"
              {...register("confirmPassword")}
            />

            <button
              type="button"
              aria-label={
                showConfirmPassword
                  ? "Hide confirmed password"
                  : "Show confirmed password"
              }
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-neutral-500"
              onClick={() =>
                setShowConfirmPassword((current) => !current)
              }
            >
              {showConfirmPassword ? (
                <EyeOff aria-hidden="true" size={18} />
              ) : (
                <Eye aria-hidden="true" size={18} />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p
              id="confirm-password-error"
              className="mt-1.5 text-sm text-red-600"
            >
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900"
        >
          {isSubmitting && (
            <LoaderCircle
              aria-hidden="true"
              className="animate-spin"
              size={18}
            />
          )}

          {isSubmitting
            ? "Updating password..."
            : "Reset password"}
        </button>
      </form>
    </section>
  );
}