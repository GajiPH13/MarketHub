import type { SellerApplicationFormValues } from "../schemas/seller-application.schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getApiUrl(): string {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  return API_URL.replace(/\/$/, "");
}

interface ApiErrorResponse {
  message?: string;
  code?: string;
  details?: {
    fieldErrors?: Record<string, string[]>;
    formErrors?: string[];
  };
}

export async function submitSellerApplication(values: SellerApplicationFormValues): Promise<void> {
  const payload = {
    businessName: values.businessName,
    businessEmail: values.businessEmail,
    businessPhone: values.businessPhone,
    businessAddress: values.businessAddress,
    sellerBio: values.sellerBio,
    categoryFocus: values.categoryFocus,
    logoUrl: values.logoUrl || null,
    documentUrl: values.documentUrl || null,
  };

  const url = `${getApiUrl()}/seller-applications`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    const responseText = await response.text();

    console.error("Non-JSON API response URL:", url);
    console.error("Non-JSON API response status:", response.status);
    console.error("Non-JSON API response body:", responseText);

    throw new Error(
      `The API returned an unexpected response (${response.status}). Check the backend route and API URL.`,
    );
  }

  const result = (await response.json()) as ApiErrorResponse;

  if (!response.ok) {
    const firstFieldError = result.details?.fieldErrors
      ? Object.values(result.details.fieldErrors).flat().find(Boolean)
      : undefined;

    throw new Error(
      firstFieldError ?? result.message ?? "Unable to submit the seller application.",
    );
  }
}
