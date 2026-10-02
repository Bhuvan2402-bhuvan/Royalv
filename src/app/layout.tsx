import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Royal V Properties | Trusted Real Estate in Guntur & Vijayawada",
    template: "%s | Royal V Properties",
  },
  description:
    "Discover premium residential and commercial properties in Guntur, Vijayawada, and the AP Capital Region with Royal V Properties (Branch of Varunya Tech). Developed & Hosted by VarunyaTech (varunyatech.in).",
  keywords: [
    "Guntur properties",
    "Vijayawada real estate",
    "AP Capital Region plots",
    "buy apartment Guntur",
    "villa Vijayawada",
    "Royal V Properties",
    "Varunya Tech",
    "VarunyaTech",
    "Amaravati plots",
    "commercial property Andhra Pradesh",
  ],
  authors: [{ name: "Royal V Properties" }, { name: "Varunya Tech" }, { name: "VarunyaTech", url: "https://varunyatech.in" }],
  creator: "Royal V Properties (Branch of Varunya Tech)",
  publisher: "VarunyaTech",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Royal V Properties (Branch of Varunya Tech)",
    title: "Royal V Properties | Trusted Real Estate Since 2006",
    description:
      "Find residential & commercial properties across Guntur, Vijayawada and the AP Capital Region. Branch of Varunya Tech. Developed & Hosted by VarunyaTech (varunyatech.in).",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 font-[family-name:var(--font-inter)]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
