import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";

import AppDownloadDrawer from "@/layout/app-download-drawer";
import { thmanyahSans } from "@/lib/fonts";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Toaster } from "@/components/ui/toast";
import { QueryProvider } from "@/components/provider/QueryClientProvider";
import ErudaLoader from "@/components/tredro/ErudaLoader";
import HardwareBackButton from "@/components/tredro/HardwareBackButton";

export const metadata: Metadata = {
  title: "Tredro | تسوّق من الشركات الموثوقة",
  description:
    "منصة تسوق للأعمال تتيح للعملاء تصفح الشركات القريبة، طلب المنتجات، ومتابعة الفواتير والطلبات في تطبيق واحد.",
  keywords: [
    "تطبيق تسوق",
    "طلبات B2B",
    "شركات موثوقة",
    "متابعة الطلبات",
    "فواتير",
    "تطبيق عملاء",
  ],
  authors: [{ name: "Tredro" }],
  metadataBase: new URL("https://example.com"),
  alternates: {
    canonical: "/",
    languages: {
      ar: "/",
    },
  },
  openGraph: {
    title: "Tredro | تسوّق من الشركات الموثوقة",
    description:
      "تصفح الشركات القريبة، اطلب المنتجات، وتابع فواتيرك وطلباتك في مكان واحد.",
    url: "https://example.com",
    siteName: "Tredro",
    locale: "ar_SA",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tredro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tredro | تسوّق من الشركات الموثوقة",
    description: "تصفح الشركات، اطلب المنتجات، وتابع طلباتك وفواتيرك.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={` ${thmanyahSans.variable}  h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_BASE_URL} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_BASE_URL} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('theme-storage');
                const theme = stored ? JSON.parse(stored).state.theme : 'light';
                if (theme === 'dark') document.documentElement.classList.add('dark');
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-thmanyah">
        <QueryProvider>
          {children}
          <AppDownloadDrawer />

          <ErudaLoader />
          <Suspense fallback={null}>
            <HardwareBackButton />
          </Suspense>

          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
