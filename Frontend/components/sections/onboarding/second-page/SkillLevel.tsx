"use client";
import Image from "next/image";
import logo from "@/public//images/logo.png";
import unselected from "@/public/SVGs/checkbox_unselected.svg";
import selected from "@/public/SVGs/checkbox_selected.svg";
import { useEffect, useState } from "react";
import AuthButton from "@/components/common/button/Button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserStore } from "@/state/store";
import { useOnboardingStore } from "@/state/useOnboardingData";

const skills = [
  {
    name: "beginner",
    desc: "Just starting out, learning the basics",
  },
  {
    name: "intermediate",
    desc: "Comfortable with the fundamentals",
  },
  {
    name: "advanced",
    desc: "Experienced and looking for challenges",
  },
];

function SkillLevel() {
  // const [selectedSkillLevel, setSelectedSkillLevel] = useState<string>("");
  const { selectedSkillLevel, setSelectedSkillLevel, selectedTags } =
    useUserStore();
  const [isRouting, setIsRouting] = useState<boolean>(false);
  const { setSkillLevel, skillLevel } = useOnboardingStore();
  const router = useRouter();

  useEffect(() => {
    console.log(selectedTags);
  }, []);
  const handleRouting = async () => {
    if (skillLevel === "") {
      toast.error("Please select a skill level");
      return;
    }

    setIsRouting(true);

    console.log(skillLevel);
    router.push("/goals");
  };

  useEffect(() => {
    console.log(skillLevel);
  }, [skillLevel]);

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
          What&apos;s your current skill level?
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
                skillLevel === item.name && "border-2 border-[#00BFA5]"
              }`}
              onClick={() => setSkillLevel(item.name)}
            >
              {skillLevel === item.name ? (
                <Image src={selected} alt="checkbox" width={30} height={30} />
              ) : (
                <Image src={unselected} alt="checkbox" width={30} height={30} />
              )}
              <div className="flex flex-col">
                <p className="font-[700] text-[#212121] capitalize">{item.name}</p>
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
          textWhileActionIsTakingPlace="Loading..."
          isAuth={false}
        />
      </div>
    </div>
  );
}

export default SkillLevel;
