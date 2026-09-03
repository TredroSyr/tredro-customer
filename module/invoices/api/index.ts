import { mockDelay } from "@/lib/mock";
import { CustomerInvoice, InvoicesListResponse, InvoiceDetailResponse } from "../types";

/** Stand-in for the eventual `/companies/:id/invoices` endpoints. */
function buildInvoices(companyId: number, companyName: string): CustomerInvoice[] {
  return [
    {
      id: companyId * 10 + 1,
      number: `INV-${companyId}001`,
      company_id: companyId,
      company_name: companyName,
      date: new Date(Date.now() - 2 * 86400000).toISOString(),
      total_amount: "185000",
      paid_amount: "185000",
      balance_due: "0",
      status: "fully_paid",
      currency: "SYP",
      lines: [
        {
          id: 1,
          product_name: "منتج تجريبي 1",
          unit_name: "قطعة",
          quantity: "10",
          unit_price: "12500",
          line_total: "125000",
        },
        {
          id: 2,
          product_name: "منتج تجريبي 2",
          unit_name: "قطعة",
          quantity: "6",
          unit_price: "10000",
          line_total: "60000",
        },
      ],
    },
    {
      id: companyId * 10 + 2,
      number: `INV-${companyId}002`,
      company_id: companyId,
      company_name: companyName,
      date: new Date(Date.now() - 8 * 86400000).toISOString(),
      total_amount: "94000",
      paid_amount: "40000",
      balance_due: "54000",
      status: "partially_paid",
      currency: "SYP",
      lines: [
        {
          id: 3,
          product_name: "منتج تجريبي 3",
          unit_name: "قطعة",
          quantity: "8",
          unit_price: "11750",
          line_total: "94000",
        },
      ],
    },
  ];
}

export async function getInvoicesByCompany(
  companyId: number,
  companyName = "",
): Promise<InvoicesListResponse> {
  const data = await mockDelay(buildInvoices(companyId, companyName), 400);
  return { success: true, message: "", data: { invoices: data } };
}

export async function getInvoiceById(
  companyId: number,
  invoiceId: number,
  companyName = "",
): Promise<InvoiceDetailResponse> {
  const invoices = buildInvoices(companyId, companyName);
  const invoice = invoices.find((i) => i.id === invoiceId);
  const data = await mockDelay(invoice, 300);
  if (!data) {
    throw new Error("الفاتورة غير موجودة");
  }
  return { success: true, message: "", data: { invoice: data } };
}
