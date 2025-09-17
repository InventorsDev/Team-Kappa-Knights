"use client";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import Navbar from "@/components/sections/Navbar";
import Sidebar from "@/components/sections/Sidebar";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout>
      <div className="min-h-screen grid grid-rows-[auto_1fr] grid-cols-1 md:grid-cols-[8%_1fr]">
        {/* Navbar spans the full width */}
        <header className="row-start-1 col-span-2 sticky top-0 z-50">
          <Navbar />
        </header>

        {/* Sidebar (only visible on md+) */}
        <aside className="hidden md:block row-start-2 col-start-1 h-full">
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="row-start-2 col-span-1 md:col-start-2 px-5 md:px-10">
          {children}
        </main>
      </div>
    </ProtectedLayout>
  );
}
