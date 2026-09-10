import { ApiEnvelope, Pagination } from "@/lib/api-types";

/** Known event keys (see backend §7). Unknown ones must still render gracefully — treat as a plain string elsewhere. */
export type NotificationEventKey =
  | "customer_request.created"
  | "customer_request.accepted"
  | "customer_request.rejected"
  | string;

export interface Notification {
  id: number;
  event_key: NotificationEventKey;
  title: string;
  body: string;
  payload: Record<string, unknown>;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface ListNotificationsParams {
  unread?: boolean;
  event_key?: string;
  page?: number;
}

export interface NotificationsListData {
  notifications: Notification[];
  unread_count: number;
  pagination: Pagination;
}

export type NotificationsListResponse = ApiEnvelope<NotificationsListData>;
export type UnreadCountResponse = ApiEnvelope<{ unread_count: number }>;
export type MarkNotificationReadResponse = ApiEnvelope<{
  notification: Pick<Notification, "id" | "is_read" | "read_at">;
}>;
export type MarkAllNotificationsReadResponse = ApiEnvelope<{
  updated_count: number;
  unread_count: number;
}>;

export type DevicePlatform = "android" | "ios" | "web";

export type RegisterDeviceResponse = ApiEnvelope<null> | { success: boolean; message: string };
export type UnregisterDeviceResponse = ApiEnvelope<null> | { success: boolean; message: string };
