"use client";
import React, { useState } from "react";
import Image from "next/image";
import logo from "@/public//images/logo.png";
import AuthButton from "@/components/common/button/Button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const goals = [
  {
    title: "Switching to a new career",
    desc: "I’m preparing for a full career change",
    logo: "new_career",
  },
  {
    title: "Master a specific skill",
    desc: "I want to go deep into one thing",
    logo: "specific_skills",
  },
  {
    title: "Stay Consistent",
    desc: "I often start strong, then fall off",
    logo: "stay_consistent",
  },
  {
    title: "Explore and stay curious",
    desc: "I just love learning at my own pace",
    logo: "explore_curious",
  },
  {
    title: "Build emotional balance",
    desc: "I want support while learning",
    logo: "emotional_balance",
  },
];

function Goals() {
  const [isRouting, setIsRouting] = useState(false);
  const [goal, setGoal] = useState("");
  const router = useRouter();
  const handleRouting = () => {
    if (goal === "") {
      toast.error("Please select a goal");
      return;
    }
    
     localStorage.setItem("learning_goal", goal);
    setIsRouting(true);
    router.push("/onboarding/mood");
  };
  return (
    <div>
      <header className="flex flex-col text-[16px] gap-4 text-center">
        <Image
          className="m-auto"
          src={logo}
          width={50}
          height={50}
          alt="logo"
        />
        <h1 className="text-[20px] md:text-[40px] font-[700] text-[#212121]">
          What’s your main learning goal right now?
        </h1>
        <p className="text-[#4A4A4A] md:text-[24px] max-w-[500px] m-auto font-[400]">
          Choose the one that best fits your current focus.
        </p>
      </header>
      <div className="max-w-[550px] m-auto flex flex-col gap-4 p-4">
        {goals.map((item, index) => {
          return (
            <div
              key={index}
              className={`flex  items-center gap-2 border w-[100%] m-auto rounded-[16px] py-4 px-2 cursor-default ${
                goal === item.title
                  ? "border-2 border-[#00BFA5]"
                  : "border-1 border-[#CCCCCC]"
              }`}
              onClick={() => setGoal(item.title)}
            >
              <Image
                src={`/images/${item.logo}.png`}
                alt="checkbox"
                width={20}
                height={20}
              />

              <div className="flex flex-col">
                <p className="font-[700] text-[#212121]">{item.title}</p>
                <p className="text-[#4A4A4A]">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div onClick={handleRouting} className="p-4 max-w-[550px] m-auto">
        <AuthButton
          text="Continue"
          action={isRouting}
          isAuth={false}
          textWhileActionIsTakingPlace="Routing..."
        />
      </div>
    </div>
  );
}

export default Goals;
