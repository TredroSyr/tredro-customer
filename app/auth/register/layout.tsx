import { PublicRoute } from "@/guards/public-route";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicRoute>{children}</PublicRoute>;
}
