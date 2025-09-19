import React, { ReactNode } from "react";

type VisualDetailType = {
  title: string;
  subtitle: string;
};

const VisualCards = ({
  props,
  children,
}: {
  props: VisualDetailType;
  children: ReactNode;
}) => {
  return (
    <div className="border border-[#CCCCCC]/50 rounded-2xl p-5 space-y-3 flex flex-col ">
      <div className="">
        <p className="font-semibold md:text-[20px]">{props.title}</p>
        <p className="text-[#4A4A4A] md:text-[18px]">{props.subtitle}</p>
      </div>
      <div className="w-full h-full">{children}</div>
    </div>
  );
};

export default VisualCards;
