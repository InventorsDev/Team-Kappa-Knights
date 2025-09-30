"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Check from "@/public/images/check-circle.png";
import Back from "@/public/dashboard/xButtonBlack.png";
import { useState } from "react";
import AuthButton from "@/components/common/button/Button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import FirstName from "@/components/common/names/FirstName";
// import { auth } from "@/lib/firebase";
// import { apiFetch } from "@/lib/apiClient";
import { useUserStore } from "@/state/store";
import Link from "next/link";
import { Lightbulb } from "lucide-react";

const moods = [
  {
    title: "motivated",
    bg: "#E9FFD8",
    logo: "motivated.png",
    borderColor: "#7CEE7C",
  },
  {
    title: "stressed",
    bg: "#F1EFFF",
    logo: "stressed.png",
    borderColor: "#9581E6",
  },
  {
    title: "excited",
    bg: "#EEF1F0",
    logo: "excited.png",
    borderColor: "#FFD26E",
  },
  {
    title: "okay",
    bg: "#FFECED",
    logo: "okay.png",
    borderColor: "#FF7474",
  },
  {
    title: "frustrated",
    bg: "#EBFFFC",
    logo: "frustrated.png",
    borderColor: "#85E4E4",
  },
  {
    title: "tired",
    bg: "#EEF1F0",
    logo: "tired.png",
    borderColor: "#FFB36E",
  },
];

function CreateJournalPage() {
  const { mood, setMood, desc, setDesc } = useUserStore();
  const [title, setTitle] = useState("");
  const [isRouting, setIsRouting] = useState(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    if (!mood) {
      toast.error("please select your mood");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast("no token");
        return;
      }
      console.log(token);
      const res = await fetch("http://34.228.198.154/journal/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: desc,
          title: title ? title : "Untitled",
          mood: mood,
        }),
      });

      if (!res.ok) throw new Error(`Server said ${res.status}`);
      setIsClicked(true); // pop the modal
      toast.success("Mood logged!");

      // Trigger custom event to refresh recent activity
      window.dispatchEvent(new CustomEvent("journal:updated"));

      setMood(" ");
      setDesc(" ");
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Couldn’t save mood, try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" text-[#212121] select-none pt-4" style={{ fontFamily: 'var(--font-nunito)' }}>
      {isClicked && (
        <section className="fixed inset-0 z-50 flex justify-center items-center bg-black/60">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg">
            <div className="flex w-full justify-end">
              <button onClick={() => setIsClicked(false)} className="p-1">
                { }
                <Image src={Back} alt="Exit" width={10} height={10} />
              </button>
            </div>
            <section className="flex flex-col justify-center items-center text-center pt-6">
              <Image src={Check} alt="Delete" width={60} height={60} />
              <p className="text-[24px] font-bold">Your mood has been logged</p>
              <p className="text-[#4A4A4A] pb-8">
                Thanks for checking in. Every step helps you understand yourself
                better.
              </p>
              <section className="flex flex-col gap-2 w-full">
                <button
                  onClick={() => setIsClicked(false)}
                  className="bg-[#00B5A5] rounded-xl py-3 text-white font-semibold"
                >
                  Done
                </button>
                <Link href={"/journals/my-journals"}>
                  <button className="bg-[#EBFFFC] rounded-xl py-3 w-full font-semibold">
                    Go To Journal
                  </button>
                </Link>
              </section>
            </section>
          </div>
        </section>
      )}
      <div className="flex flex-col gap-2 my-4">
        <label
          htmlFor="title"
          className="text-[20px]  font-semibold text-[#212121]"
        >
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Give your entry a title..."
          className="p-2 md:py-3 md:text-[18px] border rounded-lg text-[16px] focus:outline-none focus:shadow-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <section className=" md:border-2 md:border-gray-300 rounded-3xl md:p-6">
        <header className="flex flex-col text-[16px] gap-2">
          <h1 className="text-[20px]  font-semibold text-[#212121]">
            How are you feeling?
          </h1>
          <p className="text-[#4A4A4A] md:text-[20px] max-w-[500px] font-[400] md:hidden">
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
                      width={44}
                      height={44}
                    />
                  </div>
                  <p className="md:text-[20px]">{item.title}</p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-4 py-4">
            <label
              htmlFor="extra_info"
              className="text-[#212121] text-[20px]  font-[600]"
            >
              Your Thoughts
            </label>

            <textarea
              name="extra_info"
              id="extra_info"
              cols={30}
              rows={4}
              placeholder="Type a short note..."
              className="border border-[#CCCCCCCC] w-full p-4 pt-[9px] text-[16px] md:text-[24px] focus-within:outline-0 rounded-[16px] md:row-6 "
              value={desc}
              maxLength={150} // 👈 built-in clamp
              onChange={(e) => {
                setDesc(e.target.value);
              }}
            />

            <p className="text-right text-sm text-gray-500 mt-1">
              {desc.length}/150 · Max limit 150 chars
            </p>
          </div>

          <div className="bg-[#EBFFFC] p-6 mb-3 rounded-2xl">
            <div className="flex gap-2 mb-2">
              <Lightbulb className="text-[#00BFA5]"/>
              <p className="text-[#212121] text-[20px]  font-[600]">Writing Tips</p>
            </div>
              <div>
                <ul className="list-disc list-inside pl-2 text-[#4A4A4A] text-sm md:text-base">
                  <li>Be honest and authentic with your feelings</li>
                  <li>Write about what you&apos;re grateful for</li>
                  <li>Note any pattern in your moods or behaviour</li>
                  <li>Set intentions for tomorrow</li>
                </ul>
              </div>
          </div>

          <div className="md:flex justify-center md:w-full">
            <div
              className="md:flex justify-center md:w-[40%] md:text-[20px] md:py-[10px]"
              onClick={handleClick}
            >
              <AuthButton
                text="Update Entry"
                action={loading}
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

export default CreateJournalPage;
