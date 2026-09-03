import type { iconName } from "@/assets/icons/iconRenderer/types";

export type EmptyStateVariant =
  | "sales"
  | "warehouse"
  | "stores"
  | "requests"
  | "companies"
  | "products"
  | "orders"
  | "invoices"
  | "claims";

export interface EmptyStatePreset {
  icon: iconName;
  title: string;
  description: string;
  actionLabel?: string;
}

export const emptyStatePresets: Record<EmptyStateVariant, EmptyStatePreset> = {
  sales: {
    icon: "receipt_outlined",
    title: "لا توجد مبيعات ضمن هذه الفترة",
    description: "لم يتم تسجيل أي فاتورة مبيعات خلال الفترة الزمنية المحددة.",
  },
  warehouse: {
    icon: "cart_outlined",
    title: "المستودع فارغ حاليًا",
    description: "لا توجد منتجات مسجّلة في مستودع سيارتك في الوقت الحالي.",
  },
  stores: {
    icon: "store_outlined",
    title: "لا توجد محلات مسجّلة بعد",
    description: "ستظهر هنا المحلات التي يتم تخصيصها لحسابك.",
  },
  requests: {
    icon: "cart_outlined",
    title: "لا توجد طلبات سابقة",
    description: "لم يُسجَّل أي طلب لهذا المحل حتى الآن.",
  },
  companies: {
    icon: "store_outlined",
    title: "لا توجد شركات متاحة",
    description: "لم يتم العثور على شركات مطابقة في هذه المنطقة حالياً.",
  },
  products: {
    icon: "cart_outlined",
    title: "لا توجد منتجات بعد",
    description: "لم تتم إضافة منتجات من هذه الشركة حتى الآن.",
  },
  orders: {
    icon: "receipt_outlined",
    title: "لا توجد طلبات بعد",
    description: "ستظهر هنا طلباتك بمجرد إرسالها إلى إحدى الشركات.",
  },
  invoices: {
    icon: "receipt_outlined",
    title: "لا توجد فواتير بعد",
    description: "لم يتم إصدار أي فاتورة لك من هذه الشركة حتى الآن.",
  },
  claims: {
    icon: "warning_outlined",
    title: "لا توجد مطالبات بعد",
    description: "يمكنك إرسال مطالبة مرتبطة بأي فاتورة سابقة مع هذه الشركة.",
  },
};
