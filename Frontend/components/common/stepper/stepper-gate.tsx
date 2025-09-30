"use client";
import { usePathname } from "next/navigation";
import Stepper from "@/components/common/stepper/Stepper";

export default function StepperGate() {
  const pathname = usePathname();
  const hideOn = ["/final"];

  if (hideOn.includes(pathname)) return null;
  return (
    <div className="px-6 py-4">
      <Stepper />
    </div>
  );
}
