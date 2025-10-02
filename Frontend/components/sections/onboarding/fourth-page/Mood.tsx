"use client";
import React from "react";
import Image from "next/image";
import logo from "@/public//images/logo.png";
import { useState } from "react";
import AuthButton from "@/components/common/button/Button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";
import { useOnboardingStore } from "@/state/useOnboardingData";

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
  const { interests, learningGoal, skillLevel } = useOnboardingStore();
  const [itemLogo, setItemLogo] = useState("");
  const [isRouting, setIsRouting] = useState(false);

  const router = useRouter();

  const handleRoute = async () => {
    if (!mood) {
      toast.error("please select your mood");
      return;
    }
    setIsRouting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No token found. Please sign in again.');
      } else {
        const res = await fetch('http://34.228.198.154/journal/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: desc,
            title: 'Onboarding',
            mood: mood.toLowerCase(),
          }),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Failed to log mood (HTTP ${res.status})`);
        }
        toast.success('Mood logged!');
        // Notify dashboards/widgets to refresh immediately
        window.dispatchEvent(new CustomEvent('journal:updated'));
      }
    } catch (err) {
      console.error('Onboarding mood save failed:', err);
      toast.error("Couldn't save mood, try again later");
    } finally {
      router.push('/support');
      setIsRouting(false);
    }
  };
  return (
    <div className="py-8 px-4 text-[#212121]">
      <header className="flex flex-col text-[16px] gap-4 text-center">
        <Image
          className="m-auto"
          src={logo}
          width={50}
          height={50}
          alt="logo"
        />
        <h1 className="text-[20px] md:text-[40px] font-[700] text-[#212121]">
          How are you feeling right now?
        </h1>
        <p className="text-[#4A4A4A] md:text-[24px] max-w-[500px] m-auto font-[400]">
          Select one that best describes your current mood.
        </p>
      </header>

      <section className="max-w-[1000px] mt-4 m-auto">
        <div className=" grid gap-4 grid-cols-3 lg:grid-cols-6 ">
          {moods.map((item, index) => {
            return (
              <div
                key={index}
                className={` flex flex-col items-center p-3 gap-3 rounded-[16px]  cursor-pointer`}
                style={{
                  backgroundColor: item.bg,
                  border:
                    mood === item.title
                      ? `2px solid ${item.borderColor}`
                      : "none",
                }}
                onClick={() => {
                  setMood(item.title);
                  setItemLogo(item.logo);
                }}
              >
                <div className="w-[50px]">
                  <Image
                    src={`/emotions/${item.logo}`}
                    alt="logo"
                    width={100}
                    height={100}
                  />
                </div>
                <p>{item.title}</p>
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
            rows={10}
            className="border border-[#CCCCCCCC] w-full p-4 focus-within:outline-0 rounded-[16px]"
            value={desc}
            onChange={(e) => {
              setDesc(e.target.value);
            }}
          />
        </div>

        <div onClick={handleRoute}>
          <AuthButton
            text="Continue"
            action={isRouting}
            textWhileActionIsTakingPlace="Loading..."
            isAuth={false}
          />
        </div>
      </section>
    </div>
  );
}

export default Mood;
