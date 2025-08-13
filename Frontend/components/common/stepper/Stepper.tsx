"use client";

import { usePathname } from "next/navigation";

const steps = ["interests", "skill-level", "step3", "step4"]; // define your steps

export default function Stepper() {
  const pathname = usePathname();
  const currentStepIndex = steps.findIndex((step) => pathname.includes(step));
  const totalSteps = steps.length;

  return (
    <div className="flex items-center justify-end text-sm">
      <div className="relative w-10 h-10 flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="16"
            stroke="#E5E7EB"
            strokeWidth="4"
            fill="none"
          />
          <circle
            cx="18"
            cy="18"
            r="16"
            stroke="#10B981"
            strokeWidth="4"
            fill="none"
            strokeDasharray={100}
            strokeDashoffset={100 - ((currentStepIndex + 1) / totalSteps) * 100}
            transform="rotate(-90 18 18)"
          />
        </svg>
        <span className="absolute text-xs font-semibold">
          {currentStepIndex + 1}/{totalSteps}
        </span>
      </div>
    </div>
  );
}
