"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import logo from "@/public//images/logo.png";
import unselected from "@/public/SVGs/checkbox_unselected.svg";
import selected from "@/public/SVGs/checkbox_selected.svg";
import AuthButton from "@/components/common/button/Button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// import { auth } from "@/lib/firebase";
import { useOnboardingStore } from "@/state/useOnboardingData";
import { getToken } from "@/lib/token";
import { updateUserOnboardingStatus } from "@/lib/auth";

const options = [
  "I prefer calm reminders and gentle nudges",
  " I like motivational push and clear goals",
  " I want full control. Just guide me when I ask",
  " I’m still figuring it out",
];

function Support() {
  // const [support, setSupport] = useState("");
  const [isRouting, setIsRouting] = useState(false);
  const { interests, skillLevel, learningGoal, supportStyle, setSupportStyle } =
    useOnboardingStore();
  const router = useRouter();

  // Check token on component mount
  useEffect(() => {
    const token = getToken();

    if (!token) {
      console.log("No token found on mount, redirecting to login");
      toast.error("Authentication expired. Please log in again.");
      router.replace("/");
    }
  }, [router]);

  const handleRoute = async () => {
    if (!supportStyle) {
      return toast.error("please choose one");
    }

    const token = getToken();
    if (!token) {
      console.error(
        "CRITICAL: Token is null when trying to complete onboarding!"
      );
      toast.error("No authentication token found. Please log in again.");
      router.push("/");
      return;
    }

    console.log("Using token:", token);

    setIsRouting(true);

    const payload = {
      interests,
      skill_level: skillLevel,
      learning_goal: learningGoal,
      support_style: null, // Use the actual selected support style
    };

    try {
      const res = await fetch(
        "http://34.228.198.154/api/user/complete-onboarding",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Use dynamic token
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error(`Failed onboarding: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();

      console.log("Backend onboarding success:", data);

      // Update Firebase onboarding status
      try {
        await updateUserOnboardingStatus(true);
        console.log("Firebase onboarding status updated successfully");
      } catch (error) {
        console.warn(
          "Firebase onboarding status update failed, but continuing...",
          error
        );
        // Don't throw here - we don't want to fail the entire onboarding for this
      }

      toast.success("Onboarding completed successfully!");
      router.push("/final");
    } catch (err) {
      console.error("Onboarding error:", err);
      toast.error("Failed to complete onboarding. Please try again.");
    } finally {
      setIsRouting(false);
    }
  };

  return (
    <div>
      <header className="flex flex-col text-[16px] gap-4 text-center">
        <Image
          className="m-auto"
          src={logo}
          width={50}
          height={50}
          alt="logo"
        />
        <h1 className="text-[20px] md:text-[40px] font-[700] text-[#212121]">
          What kind of support helps you learn best?
        </h1>
        <p className="text-[#4A4A4A] md:text-[24px] max-w-[500px] m-auto font-[400]">
          Choose one from the options or skip.
        </p>
      </header>

      <div className="max-w-[550px] m-auto flex flex-col gap-4 p-4">
        {options.map((item, index) => {
          return (
            <div
              key={index}
              className={`flex  items-center gap-2  text-[15px] border w-[100%] m-auto rounded-[16px] py-4 px-2 cursor-default ${
                supportStyle === item && "border-2 border-[#00BFA5]"
              }`}
              onClick={() => setSupportStyle(item)}
            >
              {supportStyle === item ? (
                <Image src={selected} alt="checkbox" width={30} height={30} />
              ) : (
                <Image src={unselected} alt="checkbox" width={30} height={30} />
              )}
              <div className="flex flex-col">
                <p className="text-[#4A4A4A]">{item}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="max-w-[550px] m-auto flex flex-col gap-4">
        <div onClick={handleRoute}>
          <AuthButton
            text="Continue"
            action={isRouting}
            textWhileActionIsTakingPlace="Routing"
            isAuth={false}
          />
        </div>
        <div onClick={() => router.push("/final")}>
          <button
            type="button"
            className="w-full rounded-xl md:rounded-2xl bg-[#ebfffc] py-4 cursor-pointer"
          >
            skip
          </button>
        </div>
      </div>
    </div>
  );
}

export default Support;
