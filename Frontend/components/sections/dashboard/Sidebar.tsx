import React from "react";
import Image from "next/image";
import Link from "next/link";

const sidebarItems = [
  {
    text: "Home",
    logo: "/dashboard/house.png",
    altText: "Home",
    link: "/",
  },
  {
    text: "Journals",
    logo: "/dashboard/journal.png",
    altText: "Journals",
    link: "/journals",
  },
  {
    text: "Skills",
    logo: "/dashboard/skills.png",
    altText: "Skills",
    link: "/skilltree",
  },
  {
    text: "Insights",
    logo: "/dashboard/insights.png",
    altText: "Insights",
    link: "/insights",
  },
  {
    text: "Profile",
    logo: "/dashboard/profileLogo.png",
    altText: "Profile",
    link: "/profile",
  },
];

const Sidebar = () => {
  return (
    <aside className="w-[12%] fixed hidden md:flex flex-col justify-between h-[90vh] bg-gray-10 border-r border-gray-300">
      {/* Top items */}
      <div className="flex flex-col gap-8 mt-10">
        {sidebarItems.map((item, idx) => (
          <Link
            href={item.link}
            key={idx}
            className="flex flex-col gap-3 items-center justify-center"
          >
            <Image src={item.logo} width={32} height={32} alt={item.altText} />
            <p className="text-[16px]">{item.text}</p>
          </Link>
        ))}
      </div>

      {/* Logout at bottom */}
      <div className="flex flex-col items-center justify-center mb-6">
        <Image
          src="/dashboard/logout.png"
          width={32}
          height={32}
          alt="Log Out"
        />
        <p className="text-[16px] text-[#EA4335]">Log Out</p>
      </div>
    </aside>
  );
};

export default Sidebar;
