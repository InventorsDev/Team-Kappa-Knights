import SkillTree from "@/components/sections/skilltree/SkillTree";
import XPBar from "@/components/sections/skilltree/XPBar";
import Image from "next/image";
import skilltree from "@/public/SVGs/skilltree.svg";
import { data } from "@/lib/testData";

const num: number = 1250;

const fmt = (num: number) => num.toLocaleString();

const HomePage = () => {
  return (
    <div className="text-[#212121]">
      <header className="flex py-4 items-center justify-between text-[#212121]">
        <div>
          <h1 className="font-[700] text-[24px] md:text-[32px]">
            Your Learning Journey
          </h1>
          <p className="text-[16px]">
            Track your progress through various tech learning paths.
          </p>
        </div>
        <Image src={skilltree} alt="Skill Tree" height={70} width={70} />
      </header>
      <XPBar xp={fmt(num)} />
      <section className="flex flex-col gap-4 py-4">
        {data.map((course, idx) => {
          const total = course.subtitles.length;
          const completed = course.subtitles.filter(
            (subtitle) => subtitle.status === "completed"
          ).length;

          return (
            <SkillTree
              key={idx}
              data={course}
              completed={completed}
              total={total}
            />
          );
        })}
      </section>
    </div>
  );
};

export default HomePage;
