import React from "react";
type Props = {
  text: string;
  action: boolean;
  textWhileActionIsTakingPlace: string;
};

function AuthButton({ text, action, textWhileActionIsTakingPlace }: Props) {
  return (
    <button
      className="bg-gradient-to-r from-[#00BFA5] via-[#00BFA5] to-[rgba(0,89,77,0.8)] text-white rounded-xl md:rounded-2xl py-[12px] w-full md:py-[15px] text-xl hover:cursor-pointer"
      type="submit"
    >
      <p>{action ? textWhileActionIsTakingPlace : text}</p>
    </button>
  );
}

export default AuthButton;
