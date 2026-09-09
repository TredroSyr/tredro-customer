"use client";

import { NearbyCompaniesSection } from "@/module/companies/components/nearby-companies-section";
import { CompaniesSection } from "@/module/companies/components/companies-section";
import { RecentOrdersSection } from "@/module/orders/components/recent-orders-section";

export default function HomePage() {
  return (
    <div className="space-y-6 pb-6">
      <NearbyCompaniesSection />

      {/* <RecentOrdersSection /> */}

      <CompaniesSection />
    </div>
  );
}
