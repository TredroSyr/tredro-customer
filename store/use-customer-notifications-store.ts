"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  INITIAL_CUSTOMER_NOTIFICATIONS,
  type AppNotification,
} from "@/lib/customer-mock-data";

type CustomerNotificationsState = {
  notifications: AppNotification[];
  markNotificationsRead: () => void;
};

export const useCustomerNotificationsStore = create<CustomerNotificationsState>()(
  persist(
    (set, get) => ({
      notifications: INITIAL_CUSTOMER_NOTIFICATIONS,

      markNotificationsRead: () =>
        set({
          notifications: get().notifications.map((n) => ({ ...n, read: true })),
        }),
    }),
    { name: "tredro-customer-notifications" },
  ),
);
