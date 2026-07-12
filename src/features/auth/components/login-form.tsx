"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle, TestTubeDiagonal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { signInWithEmail } from "../../../features/auth/actions/sign-in";
import { GoogleAuthButton } from "@/features/auth/components/google-auth-button";
import {
  signInSchema,
  type SignInFormInput,
  type SignInFormValues,
} from "@/features/auth/schemas/auth.schema";

const DEMO_CUSTOMER_EMAIL = process.env.NEXT_PUBLIC_DEMO_CUSTOMER_EMAIL ?? "";

const DEMO_CUSTOMER_PASSWORD = process.env.NEXT_PUBLIC_DEMO_CUSTOMER_PASSWORD ?? "";

export function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormInput, undefined, SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit: SubmitHandler<SignInFormValues> = async (values) => {
    try {
      const data = await signInWithEmail(values);

      toast.success("Welcome back to MarketHub.");

      const user = data?.user;

      if (user?.isBlocked || user?.status === "blocked") {
        router.replace("/account-blocked");
        router.refresh();
        return;
      }

      switch (user?.role) {
        case "admin":
          router.replace("/dashboard/admin");
          break;

        case "seller":
          router.replace("/dashboard/seller");
          break;

        default:
          router.replace("/dashboard/customer");
      }

      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to sign in. Please try again.";

      toast.error(message);
    }
  };

  function handleDemoLogin(): void {
    if (!DEMO_CUSTOMER_EMAIL || !DEMO_CUSTOMER_PASSWORD) {
      toast.error("Demo credentials are not configured.");

      return;
    }

    setValue("email", DEMO_CUSTOMER_EMAIL, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue("password", DEMO_CUSTOMER_PASSWORD, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue("rememberMe", true, {
      shouldDirty: true,
    });

    setFocus("email");

    toast.success("Demo customer credentials added.");
  }

  return (
    <section className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8 dark:border-neutral-800 dark:bg-neutral-900">
      <header className="mb-6 text-center">
        <Link href="/" className="inline-block text-2xl font-bold tracking-tight">
          MarketHub
        </Link>

        <h1 className="mt-5 text-2xl font-semibold">Welcome back</h1>

        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Sign in to manage your orders, wishlist, and marketplace account.
        </p>
      </header>

      <GoogleAuthButton mode="signin" />

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />

        <span className="text-xs font-medium text-neutral-500">OR CONTINUE WITH EMAIL</span>

        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
      </div>

      <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email address
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="h-11 w-full rounded-lg border border-neutral-300 bg-transparent px-3 transition outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 dark:border-neutral-700 dark:focus:border-white"
            {...register("email")}
          />

          {errors.email && (
            <p id="email-error" className="mt-1.5 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between gap-4">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>

            <Link
              href="/forgot-password"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:underline dark:text-neutral-400 dark:hover:text-white"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              className="h-11 w-full rounded-lg border border-neutral-300 bg-transparent px-3 pr-11 transition outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 dark:border-neutral-700 dark:focus:border-white"
              {...register("password")}
            />

            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-neutral-500 transition hover:text-neutral-900 dark:hover:text-white"
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? (
                <EyeOff aria-hidden="true" size={18} />
              ) : (
                <Eye aria-hidden="true" size={18} />
              )}
            </button>
          </div>

          {errors.password && (
            <p id="password-error" className="mt-1.5 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            className="size-4 rounded border-neutral-300"
            {...register("rememberMe")}
          />

          <span className="text-sm text-neutral-600 dark:text-neutral-400">Keep me signed in</span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          {isSubmitting && <LoaderCircle aria-hidden="true" className="animate-spin" size={18} />}

          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 px-4 text-sm font-medium text-neutral-700 transition hover:border-neutral-500 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:bg-neutral-800"
          onClick={handleDemoLogin}
        >
          <TestTubeDiagonal aria-hidden="true" size={18} />
          Fill demo customer credentials
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
        New to MarketHub?{" "}
        <Link
          href="/register"
          className="font-semibold text-neutral-900 hover:underline dark:text-white"
        >
          Create an account
        </Link>
      </p>
    </section>
  );
}
