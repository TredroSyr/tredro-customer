import { OnboardingRoute } from "@/guards/onboarding-route";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OnboardingRoute>{children}</OnboardingRoute>;
}
