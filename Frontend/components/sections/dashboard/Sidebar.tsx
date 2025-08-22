import React from "react";
import Image from "next/image";
import Link from "next/link";

const sidebarItems = [
  {
    text: "Home",
    logo: "/dashboard/Home.svg",
    altText: "Home",
  },
  {
    text: "Journals",
    logo: "/dashboard/journal.svg",
    altText: "Journals",
  },
  {
    text: "Skills",
    logo: "/dashboard/skills.svg",
    altText: "Skills",
  },
  {
    text: "Insights",
    logo: "/dashboard/insights.png",
    altText: "Insights",
  },
  {
    text: "Profile",
    logo: "/dashboard/profileLogo.png",
    altText: "Profile",
  },
];

const Sidebar = () => {
  return (
    <main>
      <section className="w-[12%] h-screen fixed hidden md:block bg-gray-10 border-l border-gray-500 pt-30 pb-5 md:border-r md:border-gray-300">
        <section className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-5 justify-between">
            {sidebarItems.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-3 items-center justify-center "
              >
                <Image
                  src={`${item.logo}`}
                  width={32}
                  height={32}
                  alt={item.altText}
                />
                <p className="text-[24px] ">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3 items-center justify-center">
            <Image
              src={`/dashboard/logout.png`}
              width={32}
              height={32}
              alt={"Log Out"}
            />
            <p className="text-[24px] text-[#EA4335]">Log Out</p>
          </div>
        </section>
      </section>
    </main>
  );
};

export default Sidebar;
