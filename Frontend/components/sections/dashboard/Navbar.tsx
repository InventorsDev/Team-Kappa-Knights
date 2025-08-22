import React from "react";
import Image from "next/image";
import Profile from "@/public/dashboard/profile.png";
import SidebarIcon from "@/public/dashboard/sideFrame.png";
import Logo from "@/public/images/logo.png";
import Search from "@/public/dashboard/search.png";
import Link from "next/link";
import Sidebar from "./Sidebar";

const Navbar = () => {
  return (
    <main>
      <nav className="flex justify-between md:justify-start items-center select-none  top-0 px-3 md:pr-8 bg-white md:py-[1%]">
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
                <p className="text-[20px] font-bold">Hello, Gbemisola!</p>
                <p className="text-[14px] text-[#4A4A4A]">
                  Here's to steady growth
                </p>
              </div>
              <div className="hidden md:block">
                <p className="text-[24px] font-bold">Abiola Gbemisola</p>
                <p className="text-[18px] text-[#4A4A4A]">Admin</p>
              </div>
            </section>
          </section>
          <div className="block md:hidden">
            <Image src={SidebarIcon} width={24} height={24} alt="menu" />
          </div>
        </section>
      </nav>

      <div className="absolute top-0 left-0">
        <Sidebar />
      </div>
    </main>
  );
};

export default Navbar;
