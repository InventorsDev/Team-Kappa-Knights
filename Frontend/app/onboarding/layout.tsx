import Stepper from "@/components/common/stepper/Stepper";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
const nunito = Nunito({
  variable: "--font-nunito",
  weight: ["400", "700"],
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Get started with nuroki",
  description:
    "Unlock deeper learning with Nuroki- an intelligent study platform built to match your mind.",
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
    <section className={`${nunito.variable}`}>
      <div className="px-6 py-4">
        <Stepper />
      </div>
      {children}
    </section>
  );
}
