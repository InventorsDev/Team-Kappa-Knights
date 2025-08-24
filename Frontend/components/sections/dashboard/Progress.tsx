"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Purple from "@/public/dashboard/Vector.png";
import Green from "@/public/dashboard/greenVector.png";
import Side from "@/public/dashboard/sideArrow.png";

type JourneyType = {
  details: string;
  analytics: number;
};

const journeyContent: JourneyType[] = [
  {
    details: "Days Active",
    analytics: 5,
  },
  {
    details: "Business",
    analytics: 35,
  },
];

const Progress = () => {
  const [journey, setJourney] = useState<JourneyType[]>([]);

  useEffect(() => {
    setJourney(journeyContent);
  }, []);
  return (
    <main className="h-full flex flex-col justify-between w-full p-4 md:px-8 py-6 rounded-[16px] select-none">
      <div className="flex justify-between items-center pb-5">
        <p className="text-[18px] font-bold md:text-[24px]">Your Progress</p>
        <div className="flex gap-3 items-center">
          <p className=" text-[#4A4A4A] text-[14px] md:text-[18px]">
            View detailed analytics
          </p>
          <div>
            <Image src={Side} alt="View Analytics" />
          </div>
        </div>
      </div>
      <section className="space-y-4">
        <div className="flex justify-between items-center divide- divide-[#CCCCCC] text-[16px] font-semibold space-x-2 rounded-2xl p-[16px]  ">
          <div className="text-center space-y-2">
            <p className="text-[#886CFF] text-[24px] md:text-[40px] font-bold">
              5
            </p>
            <p className="text-[13px] md:text-[18px] font-bold">Days Active</p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-[#FF6665] text-[24px] md:text-[40px] font-bold">
              8
            </p>
            <p className="text-[13px] md:text-[18px] font-bold">
              Courses Completed
            </p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-[#7ABF00] text-[24px] md:text-[40px] font-bold">
              4.2/5
            </p>
            <p className="text-[13px] md:text-[18px] font-bold">
              Avg Mood Score
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Progress;
