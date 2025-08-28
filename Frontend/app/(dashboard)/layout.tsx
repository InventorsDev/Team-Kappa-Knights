"use client";
import Navbar from "@/components/sections/dashboard/Navbar";
import Sidebar from "@/components/sections/dashboard/Sidebar";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr] grid-cols-1 md:grid-cols-[12%_1fr]">
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
  );
}
