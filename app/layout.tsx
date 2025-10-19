// app/layout.tsx
import "./globals.css";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Coaching App",
  description: "Your personal learning and quiz platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
          <h1 className="text-xl font-bold text-blue-600">Coaching App</h1>
          <nav className="flex gap-4 text-sm">
            <Link href="/">홈</Link>
            <Link href="/login">로그인</Link>
            <Link href="/dashboard">대시보드</Link>
            <Link href="/problems/1">문제 풀기</Link>
            <Link href="/admin">관리자</Link>
          </nav>
        </header>
        <main className="max-w-4xl mx-auto p-6">{children}</main>
        <footer className="text-center text-gray-400 text-sm py-6">
          © 2025 Coaching App
        </footer>
      </body>
    </html>
  );
}
