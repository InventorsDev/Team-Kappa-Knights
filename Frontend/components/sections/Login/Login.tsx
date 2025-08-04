"use client";
import React from "react";
import Image from "next/image";
import Logo from "@/public/images/logo.png";
import Link from "next/link";
import Google from "@/public/images/Google.png";
import Picture from "@/public/images/ea1b6262a739e5fb38bc0cd69c97b27da0a6e89f.jpg";
import { useState } from "react";
import { auth, provider } from "@/lib/firebase";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { handleSignin, handleGoogleSignup } from "@/lib/auth";
import AuthButton from "@/components/common/auth-button/AuthButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const router = useRouter();
  const persistence = rememberMe
    ? browserLocalPersistence
    : browserSessionPersistence;

  const forgotPassword = async () => {
    if (!email) {
      alert("Please enter your email first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent. Check your email.");
    } catch (error) {
      console.error(error);
      alert("Error sending reset link. Is the email correct?");
    }
  };
  return (
    <main
      className="md:flex w-screen h-screen overflow-hidden select-none"
      style={{ fontFamily: "var(--font-nunito), sans-serif" }}
    >
      <section className="hidden md:block w-[40%] h-screen fixed left-0 top-0 z-10">
        <Image
          src={Picture}
          width={638}
          alt=""
          className="w-full h-full object-cover scale-110"
        />
      </section>
      <section className="md:ml-[45%] relative w-full">
        <div className="hidden md:block fixed top-[-50px] right-[-40px] h-[100px] w-[100px] bg-[#00BFA5] rounded-full filter drop-shadow-[0_0_140px_rgba(0,191,165,1)] "></div>
        <div className="hidden md:block fixed bottom-[-50px] left-[40%] h-[200px] w-[200px] bg-[#00BFA5] opacity-30 blur-[120px] pointer-events-none z-0"></div>
        <div className="flex justify-center z-20 absolute w-full overflow-y-auto h-screen px-[20px] md:px-[50px]">
          <section className="w-full max-w-[440px] md:min-w-[600px] md:max-w-[700px] mt-[64px]">
            <div className="w-full flex items-center justify-center">
              <Image src={Logo} alt="Neuroloom Logo" />
            </div>
            <div className="w-full mt-[15px] text-center">
              <div>
                <p className="text-[24px] font-bold">Welcome Back!</p>
                <p className="text-[16px] text-[#6F6F6F] font-normal">
                  Fill in the field below to log in to your account
                </p>
              </div>
              <form
                className="w-full mt-[30px]"
                onSubmit={(e) =>
                  handleSignin(
                    e,
                    email,
                    password,
                    persistence,
                    router,
                    setLoggingIn
                  )
                }
              >
                <div className="w-full">
                  <label
                    htmlFor="email"
                    className="block text-left mb-[12px] font-medium"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    className="border border-[#D9D9D9] focus:border-[#00BFA5] not-placeholder-shown:border-[#00BFA5] rounded-xl md:rounded-2xl p-[12px] md:p-[20px] w-full mb-[30px]"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-left mb-[12px] font-medium"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="min. of 8 characters"
                      className="border border-[#D9D9D9] focus:border-[#00BFA5] not-placeholder-shown:border-[#00BFA5] rounded-xl md:rounded-2xl p-[12px] w-full mb-[12px] md:p-[20px]"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-7 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.326.259-2.59.725-3.75M15 9l6 6M3 3l18 18"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.094.312-.202.617-.324.915"
                          />
                        </svg>
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between mb-[30px]">
                  <label
                    htmlFor="remember"
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="remember"
                      className="mr-[8px] accent-[#00BFA5]"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    className="hover:cursor-pointer hover:text-[#00BFA5]"
                    onClick={forgotPassword}
                  >
                    Forgot password?
                  </button>
                </div>

                <AuthButton
                  action={loggingIn}
                  text="Log in"
                  textWhileActionIsTakingPlace="Logging in"
                />
                <div className="mt-[12px] mb-[20px]">
                  <p className="text-center">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/signup"
                      className="text-[#00BFA5] hover:cursor-pointer"
                    >
                      Sign up
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
                className={` border border-[#CCCCCC] rounded-xl py-[12px] w-full ${
                  signingIn ? "cursor-not-allowed" : "cursor-pointer"
                } `}
                onClick={() =>
                  handleGoogleSignup(setSigningIn, signingIn, router)
                }
                disabled={signingIn}
              >
                <div className="flex items-center justify-center gap-[4px]">
                  <Image src={Google} alt="Google logo" />
                  <p>Sign in with Google</p>
                </div>
              </button>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default Login;
