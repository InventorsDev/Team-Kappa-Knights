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
    <div className="flex min-h-screen max-w-screen relative">
      <section className=" w-[150px  max-w-[12%] hidden md:block">
        <Sidebar />
      </section>
      <section className="hidden md:block w-full fixed">
        <Navbar />
      </section>
      <section className=" w-full max-w-[98%] md:pl-[12%]">{children}</section>
    </div>
  );
}
