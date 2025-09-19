"use client";
import Image from "next/image";
import logo from "@/public//images/logo.png";
import unselected from "@/public/SVGs/checkbox_unselected.svg";
import selected from "@/public/SVGs/checkbox_selected.svg";
import { useState } from "react";
import AuthButton from "@/components/common/button/Button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserStore } from "@/state/store";
import { useOnboardingStore } from "@/state/useOnboardingData";

const skills = [
  {
    name: "Beginner",
    desc: "Just starting out, learning the basics",
  },
  {
    name: "Intermediate",
    desc: "Comfortable with the fundamentals",
  },
  {
    name: "Advanced",
    desc: "Experienced and looking for challenges",
  },
];

function SkillLevel() {
  // const [selectedSkillLevel, setSelectedSkillLevel] = useState<string>("");
  const { selectedSkillLevel, setSelectedSkillLevel } = useUserStore();
  const [isRouting, setIsRouting] = useState<boolean>(false);
  const { setSkillLevel, skillLevel } = useOnboardingStore();
  const router = useRouter();

  const handleRouting = async () => {
    if (selectedSkillLevel === "") {
      toast.error("Please select a skill level");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://34.228.198.154/api/user/me", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skills: selectedSkillLevel,
        }),
      });

      if (!res.ok) throw new Error(`Server said ${res.status}`);
    } catch (err) {
      console.log(err);
    }

    setIsRouting(true);
    setSkillLevel(selectedSkillLevel);
    console.log(skillLevel);
    router.push("/goals");
  };

  return (
    <div className="py-8">
      <header className="flex flex-col text-[16px] gap-4 text-center">
        <Image
          className="m-auto"
          src={logo}
          width={50}
          height={50}
          alt="logo"
        />
        <h1 className="text-[20px] md:text-[40px] font-[700] text-[#212121]">
          What’s your current skill level?
        </h1>
        <p className="text-[#4A4A4A] md:text-[24px] max-w-[500px] m-auto font-[400]">
          Pick your current stage so we can match you with the right challenges.
        </p>
      </header>

      <div className="max-w-[550px] m-auto flex flex-col gap-4 p-4">
        {skills.map((item, index) => {
          return (
            <div
              key={index}
              className={`flex  items-center gap-2  text-[15px] border w-[100%] m-auto rounded-[16px] py-4 px-2 cursor-default ${
                selectedSkillLevel === item.name && "border-2 border-[#00BFA5]"
              }`}
              onClick={() => setSelectedSkillLevel(item.name)}
            >
              {selectedSkillLevel === item.name ? (
                <Image src={selected} alt="checkbox" width={30} height={30} />
              ) : (
                <Image src={unselected} alt="checkbox" width={30} height={30} />
              )}
              <div className="flex flex-col">
                <p className="font-[700] text-[#212121]">{item.name}</p>
                <p className="text-[#4A4A4A]">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="max-w-[550px] m-auto px-4 py-4" onClick={handleRouting}>
        <AuthButton
          text="Continue"
          action={isRouting}
          textWhileActionIsTakingPlace="Routing..."
          isAuth={false}
        />
      </div>
    </div>
  );
}

export default SkillLevel;
