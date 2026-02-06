/**
 * @fileoverview Centralized Error Handling Utilities
 *
 * This module provides utilities for extracting user-friendly error messages
 * from API errors across the application. It handles various error structures
 * from RTK Query and backend responses.
 *
 * @example Basic Usage
 * ```typescript
 * import { extractErrorMessage, logErrorDetails } from "@/utils/errorHandler";
 *
 * try {
 *   await someApiCall().unwrap();
 * } catch (err: any) {
 *   logErrorDetails(err, "API Call Context"); // Logs detailed error info in dev mode
 *   const message = extractErrorMessage(err, "Operation failed");
 *   toast.error(message); // Shows user-friendly message
 * }
 * ```
 *
 * @example Without Logging
 * ```typescript
 * import { extractErrorMessage } from "@/utils/errorHandler";
 *
 * try {
 *   await login(credentials).unwrap();
 * } catch (err: any) {
 *   toast.error(extractErrorMessage(err, "Login failed"));
 * }
 * ```
 */

/**
 * Utility function to extract user-friendly error messages from API errors
 * Handles various error structures from RTK Query and backend responses
 */
export function extractErrorMessage(
  err: any,
  fallbackMessage = "An error occurred",
): string {
  // RTK Query unwrap() can throw errors in different formats:
  // Format 1: { status: 400, data: { message: "...", error: "...", statusCode: 400 } }
  // Format 2: { error: { status: 400, data: { message: "...", error: "...", statusCode: 400 } } }

  const actualError = err?.error || err;
  const errorData = actualError?.data;

  if (errorData) {
    // Check for message string
    if (typeof errorData.message === "string") {
      return errorData.message;
    }

    // Check for error string
    if (typeof errorData.error === "string") {
      return errorData.error;
    }

    // Handle array of messages (validation errors)
    if (Array.isArray(errorData.message)) {
      return errorData.message.join(", ");
    }

    // Handle if data itself is a string
    if (typeof errorData === "string") {
      return errorData;
    }
  }

  // Fallback to error.message
  if (actualError?.message && typeof actualError.message === "string") {
    return actualError.message;
  }

  // Return fallback
  return fallbackMessage;
}

/**
 * Logs detailed error information to console (only in development)
 */
export function logErrorDetails(err: any, context?: string): void {
  if (import.meta.env.DEV) {
    const prefix = context ? `[${context}]` : "[Error]";
    console.error(`${prefix} Full error object:`, err);
    console.error(`${prefix} err.data:`, err?.data);
    console.error(`${prefix} err.error:`, err?.error);
    console.error(`${prefix} err.error.data:`, err?.error?.data);
    console.error(`${prefix} err.status:`, err?.status);
    console.error(`${prefix} Extracted message:`, extractErrorMessage(err));
  }
}
