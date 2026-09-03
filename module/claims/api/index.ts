import { mockDelay } from "@/lib/mock";
import {
  Claim,
  ClaimsListResponse,
  CreateClaimPayload,
  CreateClaimResponse,
} from "../types";

/** Stand-in for the eventual `/companies/:id/claims` endpoints — a claim is routed to that company's Mandub for review. */
let mockClaims: Claim[] = [];
let nextClaimId = 1;

export async function getClaimsByCompany(companyId: number): Promise<ClaimsListResponse> {
  const claims = mockClaims.filter((c) => c.company_id === companyId);
  const data = await mockDelay(claims, 350);
  return { success: true, message: "", data: { claims: data } };
}

export async function createClaim(payload: CreateClaimPayload): Promise<CreateClaimResponse> {
  // No real upload endpoint yet — an attached photo becomes a local object
  // URL so the UI can preview it, standing in for the eventual hosted URL.
  const photo_url = payload.photo ? URL.createObjectURL(payload.photo) : null;

  const claim: Claim = {
    id: nextClaimId++,
    company_id: payload.company_id,
    invoice_id: payload.invoice_id,
    invoice_number: payload.invoice_number,
    quantity: payload.quantity,
    reason: payload.reason,
    description: payload.description,
    photo_url,
    status: "pending",
    created_at: new Date().toISOString(),
  };

  mockClaims = [...mockClaims, claim];
  const data = await mockDelay(claim, 500);
  return { success: true, message: "تم إرسال مطالبتك إلى المندوب", data: { claim: data } };
}
