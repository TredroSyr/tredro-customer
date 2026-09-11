"use client";

import { useCallback } from "react";
import { isAxiosError } from "axios";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import type { ApiErrorResponse } from "@/module/auth/types";

const DEFAULT_ERROR_MESSAGE = "حدث خطأ، حاول مرة أخرى";

export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || DEFAULT_ERROR_MESSAGE;
  }
  if (error instanceof Error && error.message) return error.message;
  return DEFAULT_ERROR_MESSAGE;
}

export interface ApiFormErrorResult {
  message: string;
  fields: string[];
}

/**
 * Maps a failed action's `{ message, errors }` response onto a react-hook-form
 * instance: known fields get inline errors, and the top-level message is
 * always returned so callers can also surface it globally (e.g. via toast) —
 * otherwise errors on fields the form doesn't render (e.g. `credentials`)
 * would be silently dropped.
 */
export function useApiFormErrorHandler<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
) {
  return useCallback(
    (error: unknown): ApiFormErrorResult => {
      const message = getApiErrorMessage(error);
      const fields: string[] = [];

      if (isAxiosError<ApiErrorResponse>(error)) {
        const errors = error.response?.data?.errors;
        if (errors) {
          const values = form.getValues();
          Object.entries(errors).forEach(([field, messages]) => {
            const text = messages?.[0];
            if (!text || !(field in values)) return;
            form.setError(field as Path<TFieldValues>, {
              type: "server",
              message: text,
            });
            fields.push(field);
          });
        }
      }

      return { message, fields };
    },
    [form],
  );
}
