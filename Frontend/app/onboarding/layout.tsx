import Stepper from "@/components/common/stepper/Stepper";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import StepperGate from "../../components/common/stepper/stepper-gate";
const nunito = Nunito({
  variable: "--font-nunito",
  weight: ["400", "500", "700"],
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

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className={`${nunito.variable} `}>
      <StepperGate />
      {children}
    </section>
  );
}
