const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getApiUrl(): string {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured.",
    );
  }

  return API_URL.replace(/\/$/, "");
}

export interface SellerApplication {
  _id: string;
  userId: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  sellerBio: string;
  categoryFocus: string[];
  logoUrl?: string | null;
  documentUrl?: string | null;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SellerApplicationsResponse {
  success: boolean;
  message: string;
  data: {
    items: SellerApplication[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface ApiErrorResponse {
  message?: string;
  code?: string;
}

export async function getAdminSellerApplications(
  status?: "pending" | "approved" | "rejected",
): Promise<SellerApplicationsResponse["data"]> {
  const searchParams = new URLSearchParams();

  if (status) {
    searchParams.set("status", status);
  }

  const query = searchParams.toString();
  const url = `${getApiUrl()}/admin/seller-applications${
    query ? `?${query}` : ""
  }`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  const result = (await response.json()) as
    | SellerApplicationsResponse
    | ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      result.message ??
        "Unable to retrieve seller applications.",
    );
  }

  return (result as SellerApplicationsResponse).data;
}

export async function approveSellerApplication(
  applicationId: string,
): Promise<void> {
  const response = await fetch(
    `${getApiUrl()}/admin/seller-applications/${applicationId}/approve`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const result = (await response.json()) as ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      result.message ??
        "Unable to approve the seller application.",
    );
  }
}

export async function rejectSellerApplication(
  applicationId: string,
  rejectionReason: string,
): Promise<void> {
  const response = await fetch(
    `${getApiUrl()}/admin/seller-applications/${applicationId}/reject`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        rejectionReason,
      }),
    },
  );

  const result = (await response.json()) as ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      result.message ??
        "Unable to reject the seller application.",
    );
  }
}