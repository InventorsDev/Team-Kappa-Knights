"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Bg from "@/public/images/bg.png";
import BgMobile from "@/public/images/bg-mobile.png";
import CheckCircle from "@/public/images/check-circle.png";
import AuthButton from "@/components/common/button/Button";
import { useRouter } from "next/navigation";
import { useUsername } from "@/state/usernameStore";

const AllSet = () => {
  const name = useUsername((state) => state.name);
  const [isRouting, setIsRouting] = useState(false);
  const router = useRouter();

  const getFirstName = (fullName?: string) => {
    if (!fullName) return "stranger";
    return fullName.trim().split(" ")[0];
  };

  const handleRoute = () => {
    setIsRouting(true);
    router.push("/dashboard");
  };
  return (
    <main className="relative">
      <section className="flex items-center justify-center text-center h-screen w-screen px-6 select-none">
        <section>
          <div className="w-full flex justify-center pb-5">
            <Image
              src={CheckCircle}
              width={80}
              height={80}
              alt=""
              className="md:w-[160px] md:h-[160px]"
            />
          </div>
          <p className="text-[24px] font-[500]">
            You&apos;re all set, {getFirstName(name)}
          </p>
          <p className="text-gray-500 pb-10">
            We&apos;ve personalised your learning experience based on your
            interests, goals and mood
          </p>
          <div
            onClick={handleRoute}
            className="hover:cursor-pointer  absolute  z-10 right-6 left-6 md:mx-100"
          >
            <AuthButton
              text="Go to Dashboard"
              action={isRouting}
              textWhileActionIsTakingPlace="Routing"
              isAuth={false}
            />
          </div>
        </section>
      </section>
      <div className="absolute bottom-0 inset-0 w-full  z-0 ">
        <Image src={Bg} alt="" fill className="object-cover" />
      </div>
    </main>
  );
};

export default AllSet;
