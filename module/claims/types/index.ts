export type ClaimStatus = "pending" | "reviewed" | "resolved" | "rejected";

export type ClaimReason =
  | "damaged_product"
  | "quantity_shortage"
  | "invoice_error"
  | "other";

export interface Claim {
  id: number;
  company_id: number;
  invoice_id: number;
  invoice_number: string;
  quantity: string;
  reason: ClaimReason;
  description: string;
  photo_url: string | null;
  status: ClaimStatus;
  created_at: string;
}

export interface CreateClaimPayload {
  company_id: number;
  invoice_id: number;
  invoice_number: string;
  quantity: string;
  reason: ClaimReason;
  description: string;
  photo?: File;
}

export interface ClaimsListResponse {
  success: boolean;
  message: string;
  data: { claims: Claim[] };
}

export interface CreateClaimResponse {
  success: boolean;
  message: string;
  data: { claim: Claim };
}
