import { useState } from "react";
import AuthButton from "@/components/common/button/Button";
import Image from "next/image";
import Logo from "@/public/images/logo.png";
import Link from "next/link";
import Google from "@/public/images/Google.png";
import { toast } from "sonner";
import { handleGoogleSignup, handleCreateAccount } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { auth, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
type props = {
  setIsVerifying: (bool: boolean) => void;
  // setIsVerifying: (bool: boolean) => void;
};
function SignUpForm({ setIsVerifying }: props) {
  const [error, setError] = useState("");
  const [emailSigningIn, setEmailSigningIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const router = useRouter();

  const handleGoogleSignup = async () => {
    if (signingIn) return;
    setSigningIn(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      router.back();
      console.log(user);
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error) {
        const err = error as { code: string };
        if (err.code === "auth/popup-closed-by-user") {
          console.log("User closed the popup before completing sign-in");
        } else {
          console.error("Google Sign-In Error:", err);
        }
      }
    } finally {
      setSigningIn(false);
    }
  };
  return (
    <section className="w-full max-w-[440px] xl:min-w-[600px] xl:max-w-[700px] mt-[64px]">
      <div className="w-full flex items-center justify-center">
        <Image src={Logo} alt="Neuroloom Logo" className="" />
      </div>
      <div className="w-full mt-[15px] text-center">
        <div>
          <p style={{ fontWeight: 700 }} className="w-full text-[24px]">
            Welcome to Nuroki!
          </p>
          <p style={{ fontWeight: 400 }} className="text-[16px] text-[#6F6F6F]">
            Fill in the field below to register your account
          </p>
        </div>
        <form
          className="w-full  flex flex-col gap-6"
          onSubmit={(e) =>
            handleCreateAccount(
              e,
              password,
              setError,
              router,
              name,
              email,
              setEmailSigningIn,
              setIsVerifying
            )
          }
        >
          <div className="w-full">
            <label
              htmlFor="name"
              className="text-left block"
              style={{ fontWeight: 500 }}
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              className="border border-[#D9D9D9] focus:border-[#00BFA5]
                                           rounded-xl p-[12px] w-[100%]"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="email"
              className="text-left block"
              style={{ fontWeight: 500 }}
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com "
              className="border border-[#D9D9D9] focus:border-[#00BFA5]
             not-placeholder-shown:border-[#00BFA5] rounded-xl p-[12px] w-[100%]"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="">
            <label
              htmlFor="password"
              className="text-left block"
              style={{ fontWeight: 500 }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="min. of 8 characters"
              className="border border-[#D9D9D9]
                                     focus:border-[#00BFA5]
                                     not-placeholder-shown:border-[#00BFA5] 
                               rounded-xl p-[12px] w-full "
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className=" text-red-600 ">{error}</div>
          <AuthButton
            action={emailSigningIn}
            text="Sign up"
            textWhileActionIsTakingPlace="Signing up"
            isAuth={false}
          />
          <div className="mt-[12px] mb-[15px]">
            <p className="text-center ">
              Already have an account?{" "}
              <Link href="../" className="text-[#00BFA5] hover:cursor-pointer">
                Log in
              </Link>
            </p>
          </div>
          <section className="flex items-center gap-4 mb-[12px]">
            <hr className="flex-grow border-t border-[#CCCCCC]" />
            <span className="">or</span>
            <hr className="flex-grow border-t border-[#CCCCCC]" />
          </section>
        </form>

        <button
          className=" border border-[#CCCCCC] rounded-xl py-[12px] w-full hover:cursor-pointer"
          onClick={() => handleGoogleSignup()}
          disabled={signingIn}
        >
          <div className="flex items-center justify-center gap-[4px]">
            <Image src={Google} alt="Google logo" />
            <p>Sign in with Google</p>
          </div>
        </button>
      </div>
    </section>
  );
}

export default SignUpForm;
