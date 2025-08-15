"use client";
import React, { useState } from "react";
import Image from "next/image";
import logo from "@/public//images/logo.png";
import unselected from "@/public/SVGs/checkbox_unselected.svg";
import selected from "@/public/SVGs/checkbox_selected.svg";
import AuthButton from "@/components/common/button/Button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

  const handleRoute = () => {
    if (!support) {
      toast.error("please choose one");
    }
    router.push("");
  };
  const handleSkip = () => {
    router.push("");
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
              className={`flex  items-center gap-2  text-[15px] border w-[100%] m-auto rounded-[16px] py-4 px-2 cursor-default ${
                support === item && "border-2 border-[#00BFA5]"
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
        onClick={handleRoute}
      >
        <AuthButton
          text="Continue"
          action={isRouting}
          textWhileActionIsTakingPlace="Routing"
          isAuth={false}
        />
        <button
          type="button"
          className="w-full rounded-xl md:rounded-2xl bg-[#ebfffc] py-4 cursor-pointer"
        >
          skip
        </button>
      </div>
    </div>
  );
}

export default Support;
