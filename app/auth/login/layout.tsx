import { PublicRoute } from "@/guards/public-route";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicRoute>{children}</PublicRoute>;
}
