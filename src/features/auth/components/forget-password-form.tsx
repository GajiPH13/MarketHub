"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, LoaderCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";

import { requestUserPasswordReset } from "@/features/auth/actions/request-password-reset";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormInput,
  type ForgotPasswordFormValues,
} from "@/features/auth/schemas/auth.schema";

export function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<
    ForgotPasswordFormInput,
    undefined,
    ForgotPasswordFormValues
  >({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<
    ForgotPasswordFormValues
  > = async (values) => {
    try {
      await requestUserPasswordReset(values);

      setIsSubmitted(true);

      toast.success(
        "Check your email for password reset instructions.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to request a password reset.",
      );
    }
  };

  if (isSubmitted) {
    return (
      <section className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
          <Mail aria-hidden="true" size={22} />
        </div>

        <h1 className="mt-5 text-2xl font-semibold">
          Check your email
        </h1>

        <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          If an account exists for that email address, you will
          receive a password reset link shortly.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-neutral-900 px-5 font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          <ArrowLeft aria-hidden="true" size={17} />
          Return to login
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
          Forgot your password?
        </h1>

        <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          Enter your account email and we will send you a
          password reset link.
        </p>
      </header>

      <form
        className="space-y-5"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium"
          >
            Email address
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={
              errors.email ? "email-error" : undefined
            }
            className="h-11 w-full rounded-lg border border-neutral-300 bg-transparent px-3 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 dark:border-neutral-700 dark:focus:border-white"
            {...register("email")}
          />

          {errors.email && (
            <p
              id="email-error"
              className="mt-1.5 text-sm text-red-600"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          {isSubmitting && (
            <LoaderCircle
              aria-hidden="true"
              className="animate-spin"
              size={18}
            />
          )}

          {isSubmitting
            ? "Sending reset link..."
            : "Send reset link"}
        </button>
      </form>

      <Link
        href="/login"
        className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
      >
        <ArrowLeft aria-hidden="true" size={16} />
        Back to login
      </Link>
    </section>
  );
}