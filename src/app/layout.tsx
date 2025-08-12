import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";

export const metadata: Metadata = {
  title: "AI 계약서 스캐너",
  description: "AI 기반 계약서 리스크 분석 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <Sidebar />
        <main className="ml-[230px]">
          {children}
        </main>
      </body>
    </html>
  );
}
