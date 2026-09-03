import { mockDelay } from "@/lib/mock";
import {
  CreateOrderPayload,
  Order,
  OrderDetailResponse,
  OrdersListParams,
  OrdersListResponse,
} from "../types";

function lineTotal(quantity: number, unitPrice: string) {
  return String(quantity * Number(unitPrice));
}

/** Stand-in for the eventual `/orders` endpoints. Seeded with a few past orders so the list/Home rail aren't empty on first load. */
let mockOrders: Order[] = [
  {
    id: 1,
    company_id: 1,
    company_name: "التغذية للتوزيع",
    status: "delivered",
    lines: [
      {
        id: 1,
        product_id: 101,
        product_name: "أرز أبو كف 5 كغ",
        unit_name: "قطعة",
        quantity: "10",
        unit_price: "5000",
        line_total: "50000",
      },
    ],
    total_amount: "50000",
    delivery_address: "دمشق - المزة",
    notes: null,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 2,
    company_id: 2,
    company_name: "الشام للمشروبات",
    status: "out_for_delivery",
    lines: [
      {
        id: 2,
        product_id: 201,
        product_name: "عصير برتقال 1 لتر",
        unit_name: "قطعة",
        quantity: "20",
        unit_price: "7500",
        line_total: "150000",
      },
    ],
    total_amount: "150000",
    delivery_address: "دمشق - المزة",
    notes: null,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    company_id: 1,
    company_name: "التغذية للتوزيع",
    status: "pending",
    lines: [
      {
        id: 3,
        product_id: 102,
        product_name: "سكر أبيض 1 كغ",
        unit_name: "قطعة",
        quantity: "15",
        unit_price: "7500",
        line_total: "112500",
      },
    ],
    total_amount: "112500",
    delivery_address: "دمشق - المزة",
    notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let nextOrderId = 4;

export async function getOrders(params: OrdersListParams = {}): Promise<OrdersListResponse> {
  let orders = [...mockOrders].sort((a, b) => b.created_at.localeCompare(a.created_at));
  if (params.status) {
    orders = orders.filter((o) => o.status === params.status);
  }
  if (params.company_id) {
    orders = orders.filter((o) => o.company_id === params.company_id);
  }

  const data = await mockDelay(orders, 450);
  return {
    success: true,
    message: "",
    data: {
      orders: data,
      pagination: { count: data.length, page: 1, page_size: data.length, total_pages: 1 },
    },
  };
}

export async function getOrderById(id: number): Promise<OrderDetailResponse> {
  const order = mockOrders.find((o) => o.id === id);
  const data = await mockDelay(order, 350);
  if (!data) {
    throw new Error("الطلب غير موجود");
  }
  return { success: true, message: "", data: { order: data } };
}

export async function createOrder(payload: CreateOrderPayload): Promise<OrderDetailResponse> {
  const now = new Date().toISOString();
  const lines = payload.lines.map((line, index) => ({
    id: nextOrderId * 100 + index,
    product_id: line.product_id,
    product_name: line.product_name,
    unit_name: line.unit_name,
    quantity: String(line.quantity),
    unit_price: line.unit_price,
    line_total: lineTotal(line.quantity, line.unit_price),
  }));
  const total = lines.reduce((sum, l) => sum + Number(l.line_total), 0);

  const order: Order = {
    id: nextOrderId++,
    company_id: payload.company_id,
    company_name: payload.company_name,
    status: "pending",
    lines,
    total_amount: String(total),
    delivery_address: payload.delivery_address,
    notes: payload.notes ?? null,
    created_at: now,
    updated_at: now,
  };

  mockOrders = [...mockOrders, order];
  const data = await mockDelay(order, 500);
  return { success: true, message: "تم إرسال طلبك بنجاح", data: { order: data } };
}
