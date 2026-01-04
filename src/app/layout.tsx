import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#5DDFC3",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://roopy-diet.vercel.app"),
  title: "Roopy Diet - ケトジェニックダイエット管理",
  description: "Roopyと一緒にケトジェニックダイエットを成功させよう！体重管理、食事記録、マクロ栄養素の追跡が簡単に。",
  keywords: ["ケトジェニック", "ダイエット", "食事管理", "体重管理", "糖質制限", "マクロ栄養素"],
  authors: [{ name: "Roopy" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/Roopy-icon.png", type: "image/png" },
    ],
    apple: "/Roopy-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Roopy Diet - ケトジェニックダイエット管理",
    description: "Roopyと一緒にケトジェニックダイエットを成功させよう！",
    url: "https://roopy-diet.vercel.app",
    siteName: "Roopy Diet",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Roopy Diet - ケトジェニックダイエット管理アプリ",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roopy Diet - ケトジェニックダイエット管理",
    description: "Roopyと一緒にケトジェニックダイエットを成功させよう！",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: '#F4F9F7' }}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
