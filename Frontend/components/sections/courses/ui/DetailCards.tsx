import { StaticImageData } from "next/image";
import Link from "next/link";
import React from "react";
import { Lock, Unlock, CheckCircle } from "lucide-react";

type DetailCardsProps = {
  id: number;
  levelTitle: string;
  levelContent: string;
  levelTime: string;
  levelStatusIcon: StaticImageData | string; // kept for compatibility, no longer used visually
  levelStatus: string;
  levelLink: string
};

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'completed') return <CheckCircle size={16} className="text-[#00BFA5]" />
  if (status === 'ongoing' || status === 'in-progress') return <Unlock size={16} className="text-[#00BFA5]" />
  return <Lock size={16} className="text-gray-400" />
}

const DetailCards = ({ props }: { props: DetailCardsProps }) => {
  return (
    <div className="p-4 rounded-2xl border border-[#CCCCCC] md:text-[18px]">
      <Link href={props.levelLink}>
      <p className="">
        <span className="font-bold text-[#212121]">Level {props.id}:</span>{" "}
        {props.levelTitle}
      </p>
      <div className="text-[16px] md:text-[18px] flex justify-between ">
        <p className="text-[#4A4A4A] w-[60%] pt-3 line-clamp-3">{props.levelContent}</p>
        <button className="bg-[#00B5A5] rounded-lg text-center  md:text-[18px] px-4 py-2 h-fit  text-white font-bold">
          {props.levelTime}
        </button>
      </div>
      <div className="flex gap-2 items-center">
        <StatusIcon status={props.levelStatus} />
        <p className="text-[#00BFA5]">{props.levelStatus}</p>
      </div>
      </Link>
    </div>
  );
};

export default DetailCards;
