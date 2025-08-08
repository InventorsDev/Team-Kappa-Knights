"use client";
import { useState } from "react";
import Image from "next/image";
import logo from "@/public/favicon.ico";
import AuthButton from "@/components/common/button/Button";

const tags = [
  {
    name: "Data Analysis",
    bg: "rgb(255, 235, 235)",
    text: "rgb(153, 27, 27)",
    border: "rgb(220, 38, 38)",
    icon: "Data-Analysis",
  },
  {
    name: "Marketing",
    bg: "rgb(221, 247, 210)",
    text: "rgb(54, 83, 20)",
    border: "rgb(101, 163, 13)",
    icon: "Marketing",
  },
  {
    name: "Writing",
    bg: "rgb(234, 234, 234)",
    text: "rgb(31, 41, 55)",
    border: "rgb(156, 163, 175)",
    icon: "Writing",
  },
  {
    name: "Backend Developer",
    bg: "rgb(252, 231, 233)",
    text: "rgb(131, 24, 67)",
    border: "rgb(190, 24, 93)",
    icon: "Backend-Developer",
  },
  {
    name: "Design",
    bg: "rgb(207, 250, 254)",
    text: "rgb(21, 94, 117)",
    border: "rgb(14, 165, 233)",
    icon: "Design",
  },
  {
    name: "Time Management",
    bg: "rgb(243, 244, 246)",
    text: "rgb(31, 41, 55)",
    border: "rgb(107, 114, 128)",
    icon: "Time-Management",
  },
  {
    name: "Web3",
    bg: "rgb(237, 233, 254)",
    text: "rgb(91, 33, 182)",
    border: "rgb(126, 34, 206)",
    icon: "Web3",
  },
  {
    name: "Frontend Developer",
    bg: "rgb(207, 250, 254)",
    text: "rgb(21, 94, 117)",
    border: "rgb(14, 165, 233)",
    icon: "Frontend-Developer",
  },
  {
    name: "Public Speaking",
    bg: "rgb(220, 252, 231)",
    text: "rgb(22, 101, 52)",
    border: "rgb(34, 197, 94)",
    icon: "Public-Speaking",
  },
];

function Interest() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isClosed, setIsClosed] = useState<boolean>(true)

  return (
    <div className="p-4 ">
      <Image src={logo} className="m-auto" alt="logo" width={40} height={40} />
      <h1 className="text-xl font-[700] text-[24px] md:text-[40px] text-center mt-2">
        What are you interested in learning?
      </h1>
      <p className="text-gray-600 text-center mb-4">
        Pick 2–5 topics to help us personalize your learning path
      </p>
      <section className="flex flex-wrap max-w-[800px] m-auto py-4 justify-center gap-4 md:gap-8">
        {tags.map((tag, idx) => (
          <div
            key={idx}
            className="px-4 cursor-pointer py-3 rounded-xl text-sm font-medium border"
            style={{
              backgroundColor: tag.bg,
              color: tag.text,
              borderColor: selectedTags.includes(tag.name)
                ? tag.border
                : "transparent",
            }}
            onClick={() => {
              setSelectedTags((prevSelected) => {
                if (prevSelected.includes(tag.name)) {
                  // If tag is already selected, remove it
                  return prevSelected.filter((t) => t !== tag.name);
                } else {
                  // If not selected, add it
                  return [...prevSelected, tag.name];
                }
              });
            }}
          >
            <div className="flex items-center gap-4">
              <Image
                src={`/${tag.icon}.svg`}
                alt={tag.name}
                width={20}
                height={20}
              />
              <p>{tag.name}</p>
            </div>
          </div>
        ))}
        <div
          className="px-4 cursor-pointer py-3 rounded-xl text-sm font-medium border"
          style={{
            backgroundColor: "rgb(237, 233, 254)",
            color: "rgb(91, 33, 182)",
          }}
        >
          <div className="flex items-center gap-4" onClick={() => setIsClosed(false)}>
            <Image
              src={`/plus.svg`}
              alt="Add your own"
              width={20}
              height={20}
            />
            <p>Add Yours</p>
          </div>
        </div>
      </section>
      <div className="max-w-[600px] py-4 m-auto" >
        <AuthButton
          text="Next"
          textWhileActionIsTakingPlace="Hold on..."
          action={false}
          isAuth={false}
        />
      </div>
      <section className={`w-full min-h-screen bg-black/60 flex justify-center items-center absolute top-0 left-0 ${ isClosed ? 'hidden' : 'visible'}`}>
        <div className="p-5 py-10 rounded-xl bg-white relative w-[30%]">
        <button className="absolute right-5 top-5" onClick={() => setIsClosed(true)}>X</button>
        <label className="font-[600] text-base">Add your own interest
          <input 
          placeholder="e.g Product Manager" 
          className="w-full py-2 px-4 border border-gray-300 rounded-xl text-gray-600 mt-2 mb-4"
          onChange={(e) => e.target.value} />
        </label>
        <div className="w-full py-4 ">
          <AuthButton
          text="Done"
          textWhileActionIsTakingPlace="Hold on..."
          action={false}
          isAuth={false}
          />
          </div>
      </div>
      </section>
      
    </div>
  );
}

export default Interest;
