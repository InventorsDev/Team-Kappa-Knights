"use client";
import React, { useState } from "react";
import Image from "next/image";
import logo from "@/public//images/logo.png";
import unselected from "@/public/SVGs/checkbox_unselected.svg";
import selected from "@/public/SVGs/checkbox_selected.svg";
import AuthButton from "@/components/common/button/Button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";

const options = [
  "I prefer calm reminders and gentle nudges",
  " I like motivational push and clear goals",
  " I want full control. Just guide me when I ask",
  " I’m still figuring it out",
];




function Support() {
  const [support, setSupport] = useState("");
  const [isRouting, setIsRouting] = useState(false);
  const router = useRouter();

  const handleRoute = async () => {

    if (!support) {
      return toast.error("please choose one");
    }

    localStorage.setItem('support_style', support)

    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    const skill_level = localStorage.getItem("skill_level");
    const learning_goal = localStorage.getItem("learning_goal");
    const support_style = support;

    const payload = {
      email,
      password,
      skill_level,
      learning_goal,
      support_style
    };

    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("http://34.228.198.154/api/user/complete-onboarding", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Onboarding failed");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong completing onboarding");
    }

    router.push("/onboarding/final");
  };
  const handleSkip = () => {
    router.push("/onboarding/final");
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
          What kind of support helps you learn best?
        </h1>
        <p className="text-[#4A4A4A] md:text-[24px] max-w-[500px] m-auto font-[400]">
          Choose one from the options or skip.
        </p>
      </header>

      <div className="max-w-[550px] m-auto flex flex-col gap-4 p-4">
        {options.map((item, index) => {
          return (
            <div
              key={index}
              className={`flex  items-center gap-2  text-[15px] border w-[100%] m-auto rounded-[16px] py-4 px-2 cursor-default ${support === item && "border-2 border-[#00BFA5]"
                }`}
              onClick={() => setSupport(item)}
            >
              {support === item ? (
                <Image src={selected} alt="checkbox" width={30} height={30} />
              ) : (
                <Image src={unselected} alt="checkbox" width={30} height={30} />
              )}
              <div className="flex flex-col">
                <p className="text-[#4A4A4A]">{item}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="max-w-[550px] m-auto flex flex-col gap-4"

      >
        <div onClick={handleRoute}>
          <AuthButton
            text="Continue"
            action={isRouting}
            textWhileActionIsTakingPlace="Routing"
            isAuth={false}
          />
        </div>
        <div onClick={handleSkip}>
          <button
            type="button"
            className="w-full rounded-xl md:rounded-2xl bg-[#ebfffc] py-4 cursor-pointer"
          >
            skip
          </button>
        </div>
      </div>
    </div>
  );
}

export default Support;
