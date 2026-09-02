/**
 * Local demo data for the customer app's notification bell. There is no
 * notifications endpoint yet — this mirrors the shape of the eventual API
 * response so the header/drawer can be swapped over without a rewrite.
 */

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
};

function toISODate(d: Date) {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
}

function daysAgoISO(days: number) {
  return toISODate(new Date(Date.now() - days * 86400000));
}

export const INITIAL_CUSTOMER_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    title: "تم قبول طلبك",
    body: "قامت شركة التغذية للتوزيع بقبول طلبك وهو الآن قيد التجهيز.",
    date: toISODate(new Date()),
    read: false,
  },
  {
    id: "n2",
    title: "طلبك في الطريق",
    body: "خرج طلبك من مستودع الشام للمواد الغذائية وسيصلك قريباً.",
    date: toISODate(new Date()),
    read: false,
  },
  {
    id: "n3",
    title: "تم الرد على مطالبتك",
    body: "قام المندوب بمراجعة مطالبتك بخصوص الفاتورة رقم INV-1042.",
    date: daysAgoISO(1),
    read: true,
  },
];
