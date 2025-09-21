'use client'
import React from 'react'
import Image from "next/image";
import LogOut from "@/public/dashboard/logOutBig.png";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Logout = () => {
    const router = useRouter()
    const handleLogout = async() => {
      const token = localStorage.getItem("token");
      try {
        await fetch("http://34.228.198.154/api/user/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        localStorage.setItem('token', '')
        router.push('/')
      } catch (err){
        console.log(err)
      }
    }


  return (
    <div className='h-full'  style={{ fontFamily: "var(--font-nunito)" }}>
         <section className=" flex justify-center items-center h-screen">
                  <div className=" p-8 w-full max-w-md">
                    {/* <div className="flex w-full justify-end">
                      <Link href={'/dashboard'} className="p-1 hover:cursor-pointer">
                        <Image src={Back} alt="Exit" width={10} height={10} />
                      </Link>
                    </div> */}
                    <section className="flex flex-col justify-center items-center text-center pt-6">
                      <Image src={LogOut} alt="Log Out" width={60} height={60} />
                      <p className="text-[24px] font-bold">Are you sure you want to log out?</p>
                      <p className="text-[#4A4A4A] pb-8">
                        Logging out will end your current session and require you to sign in again to access Nuroki.
                      </p>
                      <section className="flex flex-col gap-2 w-full">
                        <Link href={'/dashboard'} className=" bg-[#FF6665] rounded-xl py-3 text-white font-semibold hover:cursor-pointer">
                          Cancel
                        </Link>
                        <button onClick={handleLogout} className="bg-[#FFF3F3] rounded-xl py-3  font-semibold hover:cursor-pointer">
                          Log Out
                        </button>
                      </section>
                    </section>
                  </div>
                </section>
    </div>
  )
}

export default Logout