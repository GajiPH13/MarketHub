// "use client";

// import {
//   Building2,
//   LoaderCircle,
//   Mail,
//   MapPin,
//   Package,
//   Phone,
//   RefreshCw,
//   ShoppingBag,
//   Star,
//   Wallet,
//   type LucideIcon,
// } from "lucide-react";
// import {
//   useCallback,
//   useEffect,
//   useState,
// } from "react";
// import { toast } from "sonner";

// import {
//   getCurrentSellerProfile,
// } from "../api/seller-profile";
// import type {
//   SellerProfile,
// } from "../types/seller.types";

// export function SellerDashboardOverview() {
//   const [sellerProfile, setSellerProfile] =
//     useState<SellerProfile | null>(null);

//   const [isLoading, setIsLoading] =
//     useState(true);

//   const loadSellerProfile =
//     useCallback(async () => {
//       try {
//         setIsLoading(true);

//         const profile =
//           await getCurrentSellerProfile();

//         setSellerProfile(profile);
//       } catch (error) {
//         setSellerProfile(null);

//         toast.error(
//           error instanceof Error
//             ? error.message
//             : "Unable to load the seller profile.",
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     }, []);

//   useEffect(() => {
//     void loadSellerProfile();
//   }, [loadSellerProfile]);

//   if (isLoading) {
//     return (
//       <div className="flex min-h-72 items-center justify-center">
//         <LoaderCircle
//           aria-hidden={true}
//           className="animate-spin"
//           size={30}
//         />

//         <span className="sr-only">
//           Loading seller profile
//         </span>
//       </div>
//     );
//   }

//   if (!sellerProfile) {
//     return (
//       <section className="rounded-2xl border border-dashed border-neutral-300 p-8 text-center dark:border-neutral-700">
//         <h2 className="text-xl font-semibold">
//           Seller profile unavailable
//         </h2>

//         <p className="mt-2 text-neutral-600 dark:text-neutral-400">
//           Your seller profile could not be loaded.
//         </p>

//         <button
//           type="button"
//           onClick={() => void loadSellerProfile()}
//           className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 text-sm font-medium transition hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
//         >
//           <RefreshCw
//             aria-hidden={true}
//             size={16}
//           />

//           Try again
//         </button>
//       </section>
//     );
//   }

//   return (
//     <section className="space-y-8">
//       <header className="flex flex-col gap-5 border-b border-neutral-200 pb-7 dark:border-neutral-800 sm:flex-row sm:items-start sm:justify-between">
//         <div className="flex gap-4">
//           <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
//             {sellerProfile.logoUrl ? (
//               // eslint-disable-next-line @next/next/no-img-element
//               <img
//                 src={sellerProfile.logoUrl}
//                 alt={`${sellerProfile.businessName} logo`}
//                 className="size-full object-cover"
//               />
//             ) : (
//               <Building2
//                 aria-hidden={true}
//                 size={26}
//               />
//             )}
//           </div>

//           <div>
//             <p className="text-sm font-medium text-neutral-500">
//               Approved seller
//             </p>

//             <h1 className="mt-1 text-3xl font-semibold">
//               {sellerProfile.businessName}
//             </h1>

//             <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
//               {sellerProfile.bio}
//             </p>
//           </div>
//         </div>

//         <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 dark:bg-green-950 dark:text-green-300">
//           Approved
//         </span>
//       </header>

//       <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         <StatCard
//           label="Products"
//           value={sellerProfile.totalProducts}
//           icon={Package}
//         />

//         <StatCard
//           label="Orders"
//           value={sellerProfile.totalOrders}
//           icon={ShoppingBag}
//         />

//         <StatCard
//           label="Revenue"
//           value={formatCurrency(
//             sellerProfile.totalRevenue,
//           )}
//           icon={Wallet}
//         />

//         <StatCard
//           label="Rating"
//           value={
//             sellerProfile.reviewCount > 0
//               ? sellerProfile.averageRating.toFixed(1)
//               : "New"
//           }
//           icon={Star}
//         />
//       </div>

//       <div className="grid gap-6 lg:grid-cols-2">
//         <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
//           <h2 className="text-lg font-semibold">
//             Business details
//           </h2>

//           <dl className="mt-5 space-y-4">
//             <DetailRow
//               icon={Mail}
//               label="Email"
//               value={sellerProfile.businessEmail}
//             />

//             <DetailRow
//               icon={Phone}
//               label="Phone"
//               value={sellerProfile.businessPhone}
//             />

//             <DetailRow
//               icon={MapPin}
//               label="Address"
//               value={sellerProfile.businessAddress}
//             />
//           </dl>
//         </article>

//         <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
//           <h2 className="text-lg font-semibold">
//             Product categories
//           </h2>

//           {sellerProfile.categoryFocus.length > 0 ? (
//             <div className="mt-5 flex flex-wrap gap-2">
//               {sellerProfile.categoryFocus.map(
//                 (category) => (
//                   <span
//                     key={category}
//                     className="rounded-full bg-neutral-100 px-3 py-1.5 text-sm font-medium capitalize dark:bg-neutral-800"
//                   >
//                     {category}
//                   </span>
//                 ),
//               )}
//             </div>
//           ) : (
//             <p className="mt-5 text-sm text-neutral-500">
//               No product categories have been selected.
//             </p>
//           )}
//         </article>
//       </div>
//     </section>
//   );
// }

// interface StatCardProps {
//   label: string;
//   value: string | number;
//   icon: LucideIcon;
// }

// function StatCard({
//   label,
//   value,
//   icon: Icon,
// }: StatCardProps) {
//   return (
//     <article className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
//       <div className="flex items-center justify-between">
//         <p className="text-sm font-medium text-neutral-500">
//           {label}
//         </p>

//         <Icon
//           aria-hidden={true}
//           size={19}
//           className="text-neutral-500"
//         />
//       </div>

//       <p className="mt-4 text-2xl font-semibold">
//         {value}
//       </p>
//     </article>
//   );
// }

// interface DetailRowProps {
//   label: string;
//   value: string;
//   icon: LucideIcon;
// }

// function DetailRow({
//   label,
//   value,
//   icon: Icon,
// }: DetailRowProps) {
//   return (
//     <div className="flex gap-3">
//       <Icon
//         aria-hidden={true}
//         size={18}
//         className="mt-0.5 shrink-0 text-neutral-500"
//       />

//       <div>
//         <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
//           {label}
//         </dt>

//         <dd className="mt-1 text-sm">
//           {value}
//         </dd>
//       </div>
//     </div>
//   );
// }

// function formatCurrency(
//   value: number,
// ): string {
//   return new Intl.NumberFormat("de-DE", {
//     style: "currency",
//     currency: "EUR",
//   }).format(value);
// }

"use client";

import {
  Building2,
  LoaderCircle,
  Mail,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  ShoppingBag,
  Star,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

import {
  getCurrentSellerProfile,
} from "../api/seller-profile";
import type {
  SellerProfile,
} from "../types/seller.types";

export function SellerDashboardOverview() {
  const [sellerProfile, setSellerProfile] =
    useState<SellerProfile | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const loadSellerProfile =
    useCallback(async (): Promise<void> => {
      try {
        setIsLoading(true);

        const profile =
          await getCurrentSellerProfile();

        setSellerProfile(profile);
      } catch (error) {
        setSellerProfile(null);

        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to load the seller profile.",
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    let isCancelled = false;

    async function initializeSellerProfile(): Promise<void> {
      try {
        const profile =
          await getCurrentSellerProfile();

        if (!isCancelled) {
          setSellerProfile(profile);
        }
      } catch (error) {
        if (!isCancelled) {
          setSellerProfile(null);

          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to load the seller profile.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void initializeSellerProfile();

    return () => {
      isCancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-72 items-center justify-center">
        <LoaderCircle
          aria-hidden={true}
          className="animate-spin"
          size={30}
        />

        <span className="sr-only">
          Loading seller profile
        </span>
      </div>
    );
  }

  if (!sellerProfile) {
    return (
      <section className="rounded-2xl border border-dashed border-neutral-300 p-8 text-center dark:border-neutral-700">
        <h2 className="text-xl font-semibold">
          Seller profile unavailable
        </h2>

        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Your seller profile could not be loaded.
        </p>

        <button
          type="button"
          disabled={isLoading}
          onClick={() =>
            void loadSellerProfile()
          }
          className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 text-sm font-medium transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:hover:bg-neutral-900"
        >
          {isLoading ? (
            <LoaderCircle
              aria-hidden={true}
              className="animate-spin"
              size={16}
            />
          ) : (
            <RefreshCw
              aria-hidden={true}
              size={16}
            />
          )}

          Try again
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-5 border-b border-neutral-200 pb-7 dark:border-neutral-800 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
            {sellerProfile.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={sellerProfile.logoUrl}
                alt={`${sellerProfile.businessName} logo`}
                className="size-full object-cover"
              />
            ) : (
              <Building2
                aria-hidden={true}
                size={26}
              />
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-neutral-500">
              Approved seller
            </p>

            <h1 className="mt-1 text-3xl font-semibold">
              {sellerProfile.businessName}
            </h1>

            <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
              {sellerProfile.bio}
            </p>
          </div>
        </div>

        <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 dark:bg-green-950 dark:text-green-300">
          Approved
        </span>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Products"
          value={sellerProfile.totalProducts}
          icon={Package}
        />

        <StatCard
          label="Orders"
          value={sellerProfile.totalOrders}
          icon={ShoppingBag}
        />

        <StatCard
          label="Revenue"
          value={formatCurrency(
            sellerProfile.totalRevenue,
          )}
          icon={Wallet}
        />

        <StatCard
          label="Rating"
          value={
            sellerProfile.reviewCount > 0
              ? sellerProfile.averageRating.toFixed(1)
              : "New"
          }
          icon={Star}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-lg font-semibold">
            Business details
          </h2>

          <dl className="mt-5 space-y-4">
            <DetailRow
              icon={Mail}
              label="Email"
              value={sellerProfile.businessEmail}
            />

            <DetailRow
              icon={Phone}
              label="Phone"
              value={sellerProfile.businessPhone}
            />

            <DetailRow
              icon={MapPin}
              label="Address"
              value={sellerProfile.businessAddress}
            />
          </dl>
        </article>

        <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-lg font-semibold">
            Product categories
          </h2>

          {sellerProfile.categoryFocus.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {sellerProfile.categoryFocus.map(
                (category) => (
                  <span
                    key={category}
                    className="rounded-full bg-neutral-100 px-3 py-1.5 text-sm font-medium capitalize dark:bg-neutral-800"
                  >
                    {category}
                  </span>
                ),
              )}
            </div>
          ) : (
            <p className="mt-5 text-sm text-neutral-500">
              No product categories have been selected.
            </p>
          )}
        </article>
      </div>
    </section>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
}

function StatCard({
  label,
  value,
  icon: Icon,
}: StatCardProps) {
  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-neutral-500">
          {label}
        </p>

        <Icon
          aria-hidden={true}
          size={19}
          className="text-neutral-500"
        />
      </div>

      <p className="mt-4 text-2xl font-semibold">
        {value}
      </p>
    </article>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  icon: LucideIcon;
}

function DetailRow({
  label,
  value,
  icon: Icon,
}: DetailRowProps) {
  return (
    <div className="flex gap-3">
      <Icon
        aria-hidden={true}
        size={18}
        className="mt-0.5 shrink-0 text-neutral-500"
      />

      <div>
        <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          {label}
        </dt>

        <dd className="mt-1 text-sm">
          {value}
        </dd>
      </div>
    </div>
  );
}

function formatCurrency(
  value: number,
): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}