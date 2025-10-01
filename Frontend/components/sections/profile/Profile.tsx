"use client";
import React from "react";
import Photo from "./Photo";
import PersonalInfo from "./PersonalInfo";
import AccountSec from "./AccountSec";
import TwoFactor from "./TwoFactor";
import Preference from "./Preference";
import Security from "./Security";
import Image from "next/image";
import Back from "@/public/dashboard/backArrow.png";
import { useRouter } from "next/navigation";

const Profile = () => {
  const router = useRouter();
  return (
    <main
      className="space-y-5  text-[#212121]"
      style={{ fontFamily: "var(--font-nunito)" }}
    >
      <section className=" hidden md:block">
        <div className="flex items-center py-3 ">
          <div onClick={() => router.back()} className="hover:cursor-pointer">
            <Image src={Back} alt="" />
          </div>
          <div className="w-full flex justify-center">
            <p className="font-semibold text-[18px]">Profile and Settings</p>
          </div>
        </div>
        <hr className="border border-[#CCCCCC]/30 w-full" />
      </section>
      <div className="md:flex block rounded-2xl md:mt-8 select-none gap-8 items-center">
        <div className="md:hidden">
        <Photo />
        </div>
        <PersonalInfo />
      </div>
      <div className="md:border rounded-2xl md:p-7 md:mt-8">
        <AccountSec />
        {/* <TwoFactor /> */}
      </div>
      {/* <Preference /> */}
      <Security />
    </main>
  );
};

export default Profile;
