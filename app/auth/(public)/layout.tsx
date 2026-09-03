import { PublicRoute } from "@/guards/public-route";

export default function PublicAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicRoute>{children}</PublicRoute>;
}
