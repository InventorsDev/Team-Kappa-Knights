import Image from "next/image";
import star from "@/public/SVGs/star.svg";
import info from "@/public/SVGs/info.svg";

interface Prop {
  xp: string;
}

function XPBar({ xp }: Prop) {
  return (
    <div className="pl-2 rounded-[24px] bg-[#00bfa5]">
      <div className="flex justify-between items-center border-[#ebfffc] p-2 rounded-[20px] bg-[#ebfffc]">
        <div className="flex gap-4 items-center">
          <div className="w-[20px] h-[20px]">
            <Image src={star} height={30} width={30} alt="xp" />
          </div>
          <p>{xp} XP</p>
        </div>
        <div className="w-[20px] h-[20px]">
          <Image src={info} height={30} width={30} alt="xp" />
        </div>
      </div>
    </div>
  );
}

export default XPBar;
