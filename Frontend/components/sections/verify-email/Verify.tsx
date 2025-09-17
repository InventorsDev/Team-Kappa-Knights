import React, { useState } from "react";
import Image from "next/image";
import email from "@/public/SVGs/email-verification.svg";
import AuthButton from "@/components/common/button/Button";
import Link from "next/link";
function Verify() {
  const [isVerifying, setIsVerifying] = useState(false);
  return (
    <section className="h-full flex flex-col justify-center text-center">
      <div className="flex flex-col  justify-center gap-4 ">
        <Image
          src={email}
          alt="email verification"
          width={50}
          height={50}
          className="m-auto"
        />
        <h1 className="font-[700] md:text-[40px] text-[24px] text-[#212121]">
          Email Verification Sent!
        </h1>
        <p className="max-w-[600px] text-[#4A4A4A]">
          A verification link has been sent to your email address. If you do not
          see it in your inbox, check your spam. if you have already verified
          click the button below
        </p>
        <Link href={"../interests"} onClick={() => setIsVerifying(true)}>
          <AuthButton
            action={isVerifying}
            text="Sign in"
            textWhileActionIsTakingPlace="Routing..."
            isAuth={false}
          />
        </Link>
      </div>
    </section>
  );
}

export default Verify;
