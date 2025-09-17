"use client";
import { useState } from "react";
import Image from "next/image";
import logo from "@/public/favicon.ico";
import AuthButton from "@/components/common/button/Button";
import { useRouter } from "next/navigation";

function OnboardingHomepage() {
  const [isRouting, setIsRouting] = useState(false);
  const router = useRouter();

  const handleRoute = () => {
    setIsRouting(true);
    router.push("/interests");
  };
  return (
    <section className="text-[#212121] md:flex md:items-center">
      <section className="h-[65vh] w-full md:rounded-none md:h-screen  onboarding overflow-hidden rounded-b-[40px]"></section>
      <section className="text-center w-full p-6 flex flex-col gap-4">
        <Image
          src={logo}
          className="m-auto"
          alt="logo"
          width={50}
          height={50}
        />
        <h1 className="font-[700] text-[24px]">Welcome To Nuroki</h1>
        <p className="text-[#4A4A4A]">
          Your learning journey starts here. Stay calm, guided, and
          personalized.
        </p>
        <div className="" onClick={handleRoute}>
          <AuthButton
            isAuth={false}
            action={isRouting}
            text="Get Started"
            textWhileActionIsTakingPlace="Hold on..."
          />
        </div>
      </section>
    </section>
  );
}

export default OnboardingHomepage;
