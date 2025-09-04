import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "UzConnect - Chet elda yashayotgan o'zbeklarni birlashtiruvchi platforma",
  description: "UzConnect - bu chet elda yashayotgan, o'qiyotgan va o'qimoqchi bo'lgan barcha o'zbeklarni birlashtiruvchi platforma. Do'stlar toping, tajriba almashing va kelajagingizni quring.",
  keywords: "UzConnect, o'zbeklar, chet el, ta'lim, hamkorlik, platforma",
  authors: [{ name: "UzConnect Team" }],
  openGraph: {
    title: "UzConnect - Chet elda yashayotgan o'zbeklarni birlashtiruvchi platforma",
    description: "Chet elda yashayotgan o'zbeklarni birlashtiruvchi platforma",
    type: "website",
    locale: "uz_UZ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" dir="ltr">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
