import React, { useState } from "react";
import Image from "next/image";
import Purple from "@/public/dashboard/purpleVector.png";

type activityType = {
  activity: string;
  time: string;
};

const activityContent: activityType[] = [
  {
    activity: "Completed level 2 of web development course",
    time: "2 days ago",
  },
  {
    activity: "Logged Mood: Happy",
    time: "1 days ago",
  },
  {
    activity: "Set new learning goals: Data Analysis",
    time: "3 days ago",
  },
];

const Recent = () => {
  return (
    <main className="border border-[#CCCCCCCC] w-full p-4 mt-10 rounded-[16px] select-none">
      <p className="text-[18px] md:text-[24px] font-bold pb-5">
        Recent Activity
      </p>
      <div className="space-y-4 divide-y divide-gray-300">
        {activityContent.map((item, index) => {
          return (
            <div
              key={index}
              className={`flex gap-2 items-center space-x-2  p-[16px] `}
            >
              <div>
                <Image src={Purple} alt="" className={`md:w-8`} />
              </div>
              <section className="w-full space-y-2">
                <div className="flex justify-between ">
                  <p className=" text-[18px] ">{item.activity}</p>
                  <p className=" text-[18px]">{item.time}</p>
                </div>
              </section>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default Recent;
