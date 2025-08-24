"use client";
import React from "react";
import Image from "next/image";
import logo from "@/public//images/logo.png";
import { useState } from "react";
import AuthButton from "@/components/common/button/Button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import FirstName from "@/components/common/names/FirstName";

const moods = [
  {
    title: "Motivated",
    bg: "#E9FFD8",
    logo: "motivated.png",
    borderColor: "#7CEE7C",
  },
  {
    title: "Stressed",
    bg: "#F1EFFF",
    logo: "stressed.png",
    borderColor: "#9581E6",
  },
  {
    title: "Excited",
    bg: "#EEF1F0",
    logo: "excited.png",
    borderColor: "#FFD26E",
  },
  {
    title: "Okay",
    bg: "#FFECED",
    logo: "okay.png",
    borderColor: "#FF7474",
  },
  {
    title: "Frustrated",
    bg: "#EBFFFC",
    logo: "frustrated.png",
    borderColor: "#85E4E4",
  },
  {
    title: "Tired",
    bg: "#EEF1F0",
    logo: "tired.png",
    borderColor: "#FFB36E",
  },
];

function Mood() {
  const [mood, setMood] = useState("");
  const [desc, setDesc] = useState("");
  const [isRouting, setIsRouting] = useState(false);
  const router = useRouter();

  const handleRoute = () => {
    if (!mood) {
      toast.error("please select your mood");
      return;
    }

    setIsRouting(true);
    router.push("/onboarding/support");
  };
  return (
    <div className=" text-[#212121] select-none pt-4">
      <div className="md:block hidden pb-7">
        <p className="text-[24px] font-bold">
          Hello, <FirstName />!
        </p>
        <p className="text-[16px] text-[#4A4A4A]">
          Here&apos;s to steady growth.
        </p>
      </div>
      <section className=" md:border-2 md:border-gray-300 rounded-3xl md:p-6">
        <header className="flex flex-col text-[16px] gap-2">
          <h1 className="text-[20px] md:text-[24px] font-semibold text-[#212121]">
            How are you feeling right now?
          </h1>
          <p className="text-[#4A4A4A] md:text-[2px] max-w-[500px] font-[400] md:hidden">
            Select one that best describes your current mood.
          </p>
        </header>

        <section className="mt-4 m-auto">
          <div className=" grid gap-4 grid-cols-3 lg:grid-cols-6 md:gap-8 md:py-4  ">
            {moods.map((item, index) => {
              return (
                <div
                  key={index}
                  className={` flex flex-col items-center p-3 gap-3 md:gap-2 rounded-[16px]  cursor-pointer`}
                  style={{
                    backgroundColor: item.bg,
                    border:
                      mood === item.title
                        ? `2px solid ${item.borderColor}`
                        : "none",
                  }}
                  onClick={() => setMood(item.title)}
                >
                  <div className="md:w-[50px]">
                    <Image
                      src={`/emotions/${item.logo}`}
                      alt="logo"
                      width={64}
                      height={64}
                    />
                  </div>
                  <p className="md:text-[24px]">{item.title}</p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-4 py-4">
            <label
              htmlFor="extra_info"
              className="text-[#212121] text-[18px] md:text-[24px] font-[500]"
            >
              What&apos;s on your mind? (Optional)
            </label>
            <textarea
              name="extra_info"
              id="extra_info"
              cols={30}
              rows={3}
              placeholder="Type a short note..."
              className="border border-[#CCCCCCCC] w-full p-4 md:p-7 pt-[9px] text-[16px] md:text-[24px] focus-within:outline-0 rounded-[16px] md:row-6 md:h-[250px]"
              value={desc}
              onChange={(e) => {
                setDesc(e.target.value);
              }}
            />
          </div>

          <div className="md:flex justify-center md:w-full">
            <div
              onClick={handleRoute}
              className="md:flex justify-center md:w-[40%] md:text-[24px] md:py-[10px]"
            >
              <AuthButton
                text="Save Today's Entry"
                action={isRouting}
                textWhileActionIsTakingPlace="Saving..."
                isAuth={false}
              />
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}

export default Mood;
