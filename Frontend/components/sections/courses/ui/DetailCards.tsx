import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React from "react";

type DetailCardsProps = {
  id: number;
  levelTitle: string;
  levelContent: string;
  levelTime: string;
  levelStatusIcon: StaticImageData | string;
  levelStatus: string;
  levelLink: string
};

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
      <div className="flex gap-2">
        <Image
          src={`/${props.levelStatusIcon}`}
          width={16}
          height={16}
          alt={`${props.levelStatus}`}
          className="objco"
        />
        <p className="text-[#00BFA5]">{props.levelStatus}</p>
      </div>
      </Link>
    </div>
  );
};

export default DetailCards;
