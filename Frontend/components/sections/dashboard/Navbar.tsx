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

const mobileNavItems = [
  {
    text: "Home",
    logo: "/dashboard/homeWhite.png",
    altText: "Home",
  },
  {
    text: "Journals",
    logo: "/dashboard/journalWhite.png",
    altText: "Journals",
  },
  {
    text: "Skills",
    logo: "/dashboard/skillWhite.png",
    altText: "Skills",
  },
  {
    text: "Insights",
    logo: "/dashboard/insightswhite.png",
    altText: "Insights",
  },
  {
    text: "Profile",
    logo: "/dashboard/profileWhite.png",
    altText: "Profile",
  },
  {
    text: "Log Out",
    logo: "/dashboard/logoutWhite.png",
    altText: "Log Out",
  },
];

const Navbar = () => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  return (
    <main>
      <nav className='flex justify-between md:justify-start items-center select-none  top-0 px-3 md:pr-8 bg-white md:py-[1%] md:border-b md:border-gray-600"'>
        <div className="hidden md:flex  w-[12%] justify-center">
          <Image src={Logo} width={49} height={49} alt="" />
        </div>
        <section className="flex justify-between w-full items-center">
          <div className="hidden md:block pl-2">
            <p className="text-[28px] font-bold">Home</p>
          </div>
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
        </section>
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
                  <div
                    key={idx}
                    className="flex  gap-3 items-center justify-cente "
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
              </section>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Navbar;
