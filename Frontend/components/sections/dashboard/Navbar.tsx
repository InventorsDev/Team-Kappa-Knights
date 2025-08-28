import React, { useState } from "react";
import Image from "next/image";
import Profile from "@/public/dashboard/profile.png";
import SidebarIcon from "@/public/dashboard/sideFrame.png";
import Logo from "@/public/images/logo.png";
import Search from "@/public/dashboard/search.png";
import Link from "next/link";
import UserName from "../../common/names/UserName";
import FirstName from "@/components/common/names/FirstName";
import X from "@/public/dashboard/xButton.png";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { pages } from "@/lib/pages";
import back from "@/public/SVGs/back.svg";

const mobileNavItems = [
  {
    text: "Home",
    logo: "/dashboard/homeWhite.png",
    altText: "Home",
    link: "/dashboard",
  },
  {
    text: "Journals",
    logo: "/dashboard/journalWhite.png",
    altText: "Journals",
    link: "/dashboard/journals",
  },
  {
    text: "Skills",
    logo: "/dashboard/skillWhite.png",
    altText: "Skills",
    link: "/skilltree",
  },
  {
    text: "Insights",
    logo: "/dashboard/insightswhite.png",
    altText: "Insights",
    link: "/dashboard/insights",
  },
  {
    text: "Profile",
    logo: "/dashboard/profileWhite.png",
    altText: "Profile",
    link: "/dashboard/profile",
  },
  {
    text: "Log Out",
    logo: "/dashboard/logoutWhite.png",
    altText: "Log Out",
    link: "",
  },
];

const Navbar = () => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const pathname = usePathname();
  const isDashboard = pathname.includes("/dashboard");
  const currentPage =
    pages.find((page) => pathname.startsWith(page.href))?.name || "Dashboard";
  console.log(currentPage);

  return (
    <main>
      <nav className=' select-none  top-0 px-3 md:pr-8 bg-white md:py-[1%] md:border-b md:border-gray-600"'>
        <div className="flex justify-between md:justify-start items-center">
          <div className="hidden md:flex  w-[12%] justify-center">
            <Image src={Logo} width={49} height={49} alt="" />
          </div>
          <div className="hidden md:block pl-2">
            <p className={`text-[24px] ${isDashboard && "font-black"}`}>Home</p>
          </div>
          <section className="flex justify-between w-full items-center">
            {isDashboard ? (
              <div className="flex justify-between w-full md:justify-end items-center py-4 md:py-0">
                <section className="md:flex items-center gap-6">
                  <div className="hidden md:block">
                    <Image src={Search} alt="" />
                  </div>
                  <section className="flex gap-2 md:gap-4 items-center">
                    <div>
                      <Image src={Profile} width={48} alt="Profile picture" />
                    </div>
                    <div className="md:hidden">
                      <p className="text-[20px] font-bold">
                        Hello, <FirstName />!
                      </p>
                      <p className="text-[14px] text-[#4A4A4A]">
                        Here's to steady growth.
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-[24px] font-bold">
                        <UserName />
                      </p>
                      <p className="text-[18px] text-[#4A4A4A]">Admin</p>
                    </div>
                  </section>
                </section>
                <div
                  className="block md:hidden cursor-pointer"
                  onClick={() => setIsClicked(true)}
                >
                  <Image src={SidebarIcon} width={24} height={24} alt="menu" />
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center w-full md:hidden py-4">
                <div className="w-[10px] h-[10px]">
                  <Image src={back} alt="back" width={20} height={20} />
                </div>
                <p className="font-[500] text-[24px]">{currentPage}</p>
                <div
                  className="block md:hidden cursor-pointer"
                  onClick={() => setIsClicked(true)}
                >
                  <Image src={SidebarIcon} width={24} height={24} alt="menu" />
                </div>
              </div>
            )}
          </section>
        </div>
      </nav>

      <AnimatePresence>
        {isClicked && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
            className="fixed inset-0 z-50"
          >
            <nav className=" flex flex-col md:hidden gap-[10%] p-6 pt-10 w-screen h-screen bg-[#005C4D]">
              <div className="pl-2" onClick={() => setIsClicked(false)}>
                <Image src={X} alt="Navbar" />
              </div>
              <section className="flex flex-col gap-10 items-cent h-full text-white">
                {mobileNavItems.map((item, idx) => (
                  <div onClick={() => setIsClicked(false)} key={idx}>
                    <Link href={item.link}>
                      <div className="flex  gap-3 items-center justify-cente ">
                        <Image
                          src={`${item.logo}`}
                          width={32}
                          height={32}
                          alt={item.altText}
                        />
                        <p className="text-[24px] ">{item.text}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </section>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Navbar;
