import React from "react";
type Props = {
  text: string;
  action: boolean;
  textWhileActionIsTakingPlace: string;
  isAuth: boolean;
  isSecondary?: boolean;
};

function AuthButton({
  text,
  action,
  textWhileActionIsTakingPlace,
  isAuth,
  isSecondary = false,
}: Props) {
  return (
    <button
      className={` ${
        isAuth
          ? "bg-gradient-to-r from-[#00BFA5] via-[#00BFA5] to-[rgba(0,89,77,0.8)]"
          : isSecondary
          ? "bg-[#EBFFFC] text-"
          : "bg-[#00BFA5]"
      }  text-white rounded-xl md:rounded-2xl py-[12px] w-full md:py-[15px] text-xl hover:cursor-pointer`}
      type="submit"
    >
      {action ? textWhileActionIsTakingPlace : text}
    </button>
  );
}

export default AuthButton;
