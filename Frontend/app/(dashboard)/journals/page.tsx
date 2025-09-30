import Image from "next/image";
import journal from "@/public/SVGs/journal.svg";
import AuthButton from "@/components/common/button/Button";
import Link from "next/link";
const wellnessData = [
  {
    title: "Mental Clarity",
    desc: "Process thoughts and emotions, gain perspective on daily experiences.",
    icon: "/SVGs/brain.svg",
    color: "#E6FBE6", // light green background
  },
  {
    title: "Emotional Wellbeing",
    desc: "Track mood patterns, celebrate wins, and practice gratitude.",
    icon: "/SVGs/heart.svg",
    color: "#FFE6E6", // light pink background
  },
  {
    title: "Personal Growth",
    desc: "Identify patterns, set intentions, and track your wellness journey.",
    icon: "/SVGs/growth.svg",
    color: "#F3E6FF", // light purple background
  },
];

const renderedWellnessData = wellnessData.map((item, index) => {
  return (
    <div
      key={index}
      className="p-2 rounded-lg "
      style={{ backgroundColor: item.color }}
    >
      <div className="flex gap-4 p-3 items-center rounded-lg">
        <div>
          <Image src={item.icon} alt={item.title} width={30} height={30} />
        </div>
        <div>
          <h1 className=" text-[#212121] text-[1.0em]  font-semibold">
            {item.title}
          </h1>
          <p className="text-[0.8em] text-[#4A4A4A]">{item.desc}</p>
        </div>
      </div>
    </div>
  );
});

function JournalPage() {
  return (
    <div className="flex flex-col gap-4" style={{ fontFamily: 'var(--font-nunito)'}}>
      <div className="flex gap-4 p-3 border items-center rounded-2xl my-4">
        <div className="h-[80px] w-[50px] flex items-center justify-center">
          <Image src={journal} alt="journal" width={30} height={30} />
        </div>
        <div>
          <h1 className=" text-[#212121] text-[1.5em]  font-semibold">
            Journal
          </h1>
          <p className="text-[16px] text-[#4A4A4A]">Your personal space for reflection</p>
        </div>
      </div>
      <section>
        <h1 className=" text-[#212121] text-[1.3em] my-4  font-semibold">
          How Journaling Helps;{" "}
        </h1>
        <section className="flex flex-col gap-4">
          {renderedWellnessData}
        </section>
      </section>
      <section className="flex justify-center">
         <section className="py-8 md:w-[30%] w-full flex flex-col gap-4">
        <Link href="/journals/my-journals">
          <AuthButton
            // isSecondary
            text="View My Journal"
            textWhileActionIsTakingPlace="Creating Journal"
            action={false}
            isAuth={false}
          />
        </Link>
        <Link href="/journals/create-journal">
          <AuthButton
            isSecondary={true}
            text="Start Writing"
            textWhileActionIsTakingPlace="Loading"
            action={false}
            isAuth={false}
          />
        </Link>
      </section>
      </section>
     
    </div>
  );
}

export default JournalPage;
