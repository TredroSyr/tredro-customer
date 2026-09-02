import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth is device-local (zustand+localStorage, no server session cookie), so
// there is no reliable server-side signal here — the real redirect happens
// client-side in app/page.tsx. This just gets `/` moving instantly instead
// of flashing the splash screen while JS loads.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
