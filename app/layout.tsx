import type { Metadata } from "next";
import { Nunito, Inter } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  weight: ['400', '700'],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  weight: ['400', '500', '700'],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neuroloom",
  description: "Unlock deeper learning with Neuroloom—an intelligent study platform built to match your mind.",
  icons: {
    icon: '/favicon.ico', 
  },
  viewport: 'width=device-width, initial-scale=1.0',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
