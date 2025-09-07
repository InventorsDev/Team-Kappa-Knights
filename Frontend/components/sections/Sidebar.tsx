import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  {
    text: "Home",
    logo: "/dashboard/home.png",
    altText: "Home",
    link: "/dashboard",
    green: "/dashboard/house.png",
  },
  {
    text: "Journals",
    logo: "/dashboard/journal.png",
    altText: "Journals",
    link: "/journals",
    green: "/dashboard/journalGreen.png",
  },
  {
    text: "Courses",
    logo: "/dashboard/courses.png",
    altText: "Courses",
    link: "/courses",
    green: "/dashboard/coursesGreen.png",
  },
  {
    text: "Skills",
    logo: "/dashboard/skills.png",
    altText: "Skills",
    link: "/skilltree",
    green: "/dashboard/skillGreen.png",
  },
  {
    text: "Insights",
    logo: "/dashboard/insights.png",
    altText: "Insights",
    link: "/insights",
    green: "/dashboard/insightsGreen.png",
  },
  {
    text: "Profile",
    logo: "/dashboard/profileLogo.png",
    altText: "Profile",
    link: "/profile",
    green: "/dashboard/profileGreen.png",
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  return (
    // <aside className="w-[12%] hidden md:flex flex-col justify-between h-[90vh] bg-gray-10 border-r border-gray-300">
    <aside className="w-[8%] fixed h-[90vh] overflow-auto hidden md:flex flex-col justify-between bg-gray-10 border-r border-gray-300">
      {/* Top items */}
      <div className="flex flex-col gap-8 mt-3">
        {sidebarItems.map((item, idx) => (
          <Link
            href={item.link}
            key={idx}
            className="flex flex-col gap-3 items-center justify-center"
          >
            <div
              className={`text-[16px] w-full flex flex-col items-center py-2   ${
                pathname === item.link
                  ? "text-[#00BFA5] bg-[#EBFFFC] border-r-3 border-[#00BFA5]"
                  : "text-[#212121] bg-white"
              }`}
            >
              <Image
                src={pathname === item.link ? item.green : item.logo}
                width={25}
                height={25}
                alt={item.altText}
              />
              <p>{item.text}</p>
            </div>
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
