import type { Metadata } from "next";
import { Nunito, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/AuthProvider";

const nunito = Nunito({
  variable: "--font-nunito",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neuroloom",
  description:
    "Unlock deeper learning with Neuroloom—an intelligent study platform built to match your mind.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${inter.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              toast:
                "bg-white text-[#00BFA5] border-none shadow-lg mt-[50px] rounded-xl px-6 py-4 ",
            },
          }}
        />
      </body>
    </html>
  );
}
