export interface AuthErrorDetails {
  title: string;
  message: string;
  canRetry: boolean;
}

const AUTH_ERRORS: Record<string, AuthErrorDetails> = {
  access_denied: {
    title: "Authentication cancelled",
    message:
      "You cancelled the authentication process or denied MarketHub access.",
    canRetry: true,
  },

  no_code: {
    title: "Authorization code missing",
    message:
      "The authentication provider did not return the required authorization code.",
    canRetry: true,
  },

  state_mismatch: {
    title: "Authentication verification failed",
    message:
      "The authentication request could not be verified. Please start the login process again.",
    canRetry: true,
  },

  state_generation_error: {
    title: "Authentication could not start",
    message:
      "MarketHub could not securely start the authentication request.",
    canRetry: true,
  },

  oauth_provider_not_found: {
    title: "Authentication provider unavailable",
    message:
      "The selected authentication provider is not configured correctly.",
    canRetry: false,
  },

  no_callback_url: {
    title: "Return address missing",
    message:
      "MarketHub could not determine where to return after authentication.",
    canRetry: true,
  },

  unable_to_get_user_info: {
    title: "Profile information unavailable",
    message:
      "MarketHub could not retrieve the required account details from the authentication provider.",
    canRetry: true,
  },

  redirect_uri_mismatch: {
    title: "Authentication configuration error",
    message:
      "The authentication callback address does not match the provider configuration.",
    canRetry: false,
  },

  account_blocked: {
    title: "Account restricted",
    message:
      "Your MarketHub account is currently blocked. Contact support for assistance.",
    canRetry: false,
  },

  invalid_token: {
    title: "Authentication link expired",
    message:
      "This authentication or verification link is invalid or has expired.",
    canRetry: true,
  },
};

export function getAuthErrorDetails(
  errorCode: string | null,
): AuthErrorDetails {
  if (!errorCode) {
    return {
      title: "Authentication failed",
      message:
        "MarketHub could not complete the authentication request.",
      canRetry: true,
    };
  }

  const normalizedCode = errorCode.trim().toLowerCase();

  return (
    AUTH_ERRORS[normalizedCode] ?? {
      title: "Authentication failed",
      message:
        "An unexpected authentication error occurred. Please try again.",
      canRetry: true,
    }
  );
}