"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Purple from "@/public/dashboard/purpleVector.png";
import Green from "@/public/dashboard/business.png";
import Side from "@/public/dashboard/sideArrow.png";
import Link from "next/link";
import { data } from "@/lib/testData";

type JourneyType = {
  journey: string;
  percent: number;
};

const journeyContent: JourneyType[] = [
  {
    journey: "Web3",
    percent: 50,
  },
  {
    journey: "Business",
    percent: 35,
  },
];

const shownData = data.slice(0, 2);

const LearningJourney = () => {
  const [journey, setJourney] = useState<JourneyType[]>([]);

  useEffect(() => {
    setJourney(journeyContent);
  }, []);
  return (
    <main className="w-full p-4 md:px-8 rounded-[16px] h-full flex flex-col justify-between select-none">
      <div className=" pb-5 flex items-center justify-between">
        <p className="text-[18px] md:text-[24px] font-bold">
          Your Learning Journey
        </p>
        <div >
          <Link href={'/skilltree'} className="flex gap-3 items-center">
          <p className=" text-[#4A4A4A] text-[14px] md:text-[18px]">
            View more
          </p>
          <div>
            <Image src={Side} alt="View Analytics" />
          </div>
          </Link>
        </div>
      </div>
      <div className="space-y-4">
        {shownData.map((item, index) => {
          const isGreen = index % 2 !== 0;
          const total = item.subtitles.length;
          const completed = item.subtitles.filter(
            (subtitle) => subtitle.status === "completed"
          ).length;
          const progress =
            total > 0 ? Math.min((completed / total) * 100, 100) : 0;
          return (
            <div
              key={index}
              className={`flex gap-2 items-center text-[16px] font-semibold space-x-2 rounded-2xl p-[16px] ${
                isGreen ? "bg-[#EBFFFC]" : "bg-[#F1EFFF]"
              } `}
            >
              <div>
                {isGreen && <Image src={Green} width={32} height={32} alt="" className={``} />}
                {!isGreen && <Image src={Purple} width={32} height={32} alt="" className={``} />}
              </div>
              <section className="w-full space-y-2">
                <div className="flex justify-between gap-2 ">
                  <p className="font-semibold text-[18px] max-w-[185px] md:max-w-none truncate">
                    {item.title}
                  </p>
                  <p className="font-medium md:text-[18px]">{progress}%</p>
                </div>
                <div className={`my-2 h-[6px] w-full ${isGreen ? 'bg-[#AAF4E9]' : 'bg-[#D7D2FF]'} rounded-lg overflow-hidden`} >
                  <div
                    className={`h-full  ${ isGreen ? 'bg-[#00bfa5]' : 'bg-[#886CFF]'} rounded-lg`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </section>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default LearningJourney;
