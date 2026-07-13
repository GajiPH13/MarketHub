import type {
  SellerProfile,
  SellerProfileResponse,
} from "../types/seller.types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

function getApiUrl(): string {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured.",
    );
  }

  return API_URL.replace(/\/$/, "");
}

interface ApiErrorResponse {
  success?: false;
  message?: string;
  code?: string;
}

export async function getCurrentSellerProfile(): Promise<SellerProfile> {
  const response = await fetch(
    `${getApiUrl()}/sellers/me`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  const result = (await response.json()) as
    | SellerProfileResponse
    | ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      result.message ??
        "Unable to retrieve the seller profile.",
    );
  }

  return (result as SellerProfileResponse)
    .data.sellerProfile;
}