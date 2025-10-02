"use client";
import React from "react";
import Image from "next/image";
// import Picture from "@/public/images/man-relaxing-taking-care-himself.png";
import Picture from "@/public/images/ea1b6262a739e5fb38bc0cd69c97b27da0a6e89f.jpg";
import { useState } from "react";
import SignUpForm from "@/components/layout/forms/SignUpForm";
import Verify from "../verify-email/Verify";
const CreateAcct = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  return (
    <main
      className="xl:flex w-screen h-screen overflow-hidden select-none"
      style={{ fontFamily: "var(--font-nunito), sans-serif" }}
    >
      <section className="hidden xl:block w-[40%] h-screen fixed left-0 top-0 z-10">
        <Image
          src={Picture}
          width={638}
          priority
          // blurDataURL="https://res.cloudinary.com/dlpty7kky/image/upload/w_10,q_1,e_blur:1000/v1754322897/man-relaxing-taking-care-himself_yctzwn.png"
          blurDataURL="https://res.cloudinary.com/dexchhhbs/image/upload/v1759407238/Frame_1_wlsvti.png"
          height={100}
          alt=""
          className="w-full h-full object-cover scale-110"
        />
      </section>
      <section className="xl:ml-[45%] relative w-full">
        <div className="hidden md:block fixed top-[-50px] right-[-40px] h-[100px] w-[100px] bg-[#00BFA5] rounded-full filter drop-shadow-[0_0_140px_rgba(0,191,165,1)] "></div>
        <div className="hidden md:block fixed bottom-[-50px] left-[40%] h-[200px] w-[200px] bg-[#00BFA5] opacity-30 blur-[120px] pointer-events-none z-0"></div>
        <div className="flex justify-center z-20 absolute w-full  overflow-y-auto h-screen px-[20px] xl:px-[50px] ">
          {isVerifying ? (
            <Verify />
          ) : (
            <SignUpForm setIsVerifying={setIsVerifying} />
          )}
        </div>
      </section>
    </main>
  );
};

export default CreateAcct;
