"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  useForm,
  type SubmitHandler,
} from "react-hook-form";
import { toast } from "sonner";

import { signUpWithEmail } from "@/features/auth/actions/sign-up";
import { GoogleAuthButton } from "@/features/auth/components/google-auth-button";
import {
  signUpSchema,
  type SignUpFormInput,
  type SignUpFormValues,
} from "@/features/auth/schemas/auth.schema";

export function RegisterForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<
    SignUpFormInput,
    undefined,
    SignUpFormValues
  >({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onSubmit: SubmitHandler<SignUpFormValues> = async (
    values,
  ) => {
    try {
      await signUpWithEmail(values);

      toast.success("Your MarketHub account was created.");

      router.push("/dashboard/customer");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create your account.",
      );
    }
  };

  return (
    <section className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
      <header className="mb-6 text-center">
        <Link
          href="/"
          className="inline-block text-2xl font-bold tracking-tight"
        >
          MarketHub
        </Link>

        <h1 className="mt-5 text-2xl font-semibold">
          Create your account
        </h1>

        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Join MarketHub to shop from trusted marketplace sellers.
        </p>
      </header>

      <GoogleAuthButton mode="signup" />

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />

        <span className="text-xs font-medium text-neutral-500">
          OR CONTINUE WITH EMAIL
        </span>

        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
      </div>

      <form
        className="space-y-5"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium"
          >
            Full name
          </label>

          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Amina Rahman"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={
              errors.name ? "name-error" : undefined
            }
            className="h-11 w-full rounded-lg border border-neutral-300 bg-transparent px-3 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 dark:border-neutral-700 dark:focus:border-white"
            {...register("name")}
          />

          {errors.name && (
            <p
              id="name-error"
              className="mt-1.5 text-sm text-red-600"
            >
              {errors.name.message}
            </p>
          )}
        </div>

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
            placeholder="amina@example.com"
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

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a secure password"
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
                showPassword ? "Hide password" : "Show password"
              }
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-neutral-500 transition hover:text-neutral-900 dark:hover:text-white"
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

          {errors.password ? (
            <p
              id="password-error"
              className="mt-1.5 text-sm text-red-600"
            >
              {errors.password.message}
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-neutral-500">
              Use at least eight characters, including uppercase,
              lowercase, and a number.
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm font-medium"
          >
            Confirm password
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              type={
                showConfirmPassword ? "text" : "password"
              }
              autoComplete="new-password"
              placeholder="Enter the password again"
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
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-neutral-500 transition hover:text-neutral-900 dark:hover:text-white"
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

        <div>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 size-4 rounded border-neutral-300"
              {...register("acceptTerms")}
            />

            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              I agree to the{" "}
              <Link
                href="/terms"
                className="font-medium text-neutral-900 underline underline-offset-4 dark:text-white"
              >
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-neutral-900 underline underline-offset-4 dark:text-white"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          {errors.acceptTerms && (
            <p className="mt-1.5 text-sm text-red-600">
              {errors.acceptTerms.message}
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
            ? "Creating account..."
            : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-neutral-900 hover:underline dark:text-white"
        >
          Sign in
        </Link>
      </p>
    </section>
  );
}