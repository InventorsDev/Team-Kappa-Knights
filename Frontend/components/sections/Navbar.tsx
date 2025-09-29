// 'use client'
// import React, { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { motion, AnimatePresence } from 'framer-motion'
// import Link from 'next/link'
// import { LayoutGrid, Moon, Bell, Search, User } from 'lucide-react'

// const navItems = [
//   { href: '/courses', label: 'Courses' },
//   { href: '/saved', label: 'Saved' },
//   { href: '/settings', label: 'Settings' },
// ]

// const Navbar = () => {
//   const router = useRouter()
//   const [searchOpen, setSearchOpen] = useState(false)
//   const [term, setTerm] = useState('')

//   const handleSearchSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (term.trim()) {
//       router.push(`/courses?search=${encodeURIComponent(term.trim())}`)
//       setTerm('')
//       setSearchOpen(false)
//     }
//   }

//   return (
//     <nav className="flex items-center justify-between px-6 py-4 bg-[#111015] text-white relative">
//       {/* Left side */}
//       <div className="flex items-center gap-6">
//         <Link href="/" className="font-bold text-lg">
//           Nuroki
//         </Link>
//         <div className="hidden md:flex gap-6">
//           {navItems.map((item) => (
//             <Link
//               key={item.href}
//               href={item.href}
//               className="hover:text-gray-300 transition"
//             >
//               {item.label}
//             </Link>
//           ))}
//         </div>
//       </div>

//       {/* Right side */}
//       <div className="flex items-center gap-3 flex-1 justify-end">
//         {/* Inline expanding search */}
//         <AnimatePresence initial={false}>
//           {searchOpen ? (
//             <motion.form
//               key="searchbar"
//               onSubmit={handleSearchSubmit}
//               initial={{ width: 0, opacity: 0 }}
//               animate={{ width: 250, opacity: 1 }}
//               exit={{ width: 0, opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className="flex items-center gap-2 overflow-hidden bg-[#1E1E1E] rounded-lg px-3 py-1"
//             >
//               <input
//                 type="text"
//                 placeholder="Search courses..."
//                 value={term}
//                 onChange={(e) => setTerm(e.target.value)}
//                 className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
//               />
//               <button type="submit" aria-label="Submit search">
//                 <Search size={18} />
//               </button>
//             </motion.form>
//           ) : (
//             <button
//               key="searchicon"
//               onClick={() => setSearchOpen(true)}
//               className="p-2 rounded-full bg-[#1E1E1E] hover:bg-gray-600"
//               aria-label="Open search"
//             >
//               <Search size={20} />
//             </button>
//           )}
//         </AnimatePresence>

//         {/* Other icons */}
//         <button
//           className="hidden md:block p-2 rounded-full bg-[#1E1E1E] hover:bg-gray-600"
//           aria-label="Notifications"
//         >
//           <Bell size={20} />
//         </button>
//         <button
//           className="hidden md:block p-2 rounded-full bg-[#1E1E1E] hover:bg-gray-600"
//           aria-label="Toggle Theme"
//         >
//           <Moon size={20} />
//         </button>
//         <button
//           className="hidden md:block p-2 rounded-full bg-[#1E1E1E] hover:bg-gray-600"
//           aria-label="Profile"
//         >
//           <User size={20} />
//         </button>
//         <button
//           className="md:hidden p-2 rounded-full bg-[#1E1E1E] hover:bg-gray-600"
//           aria-label="Menu"
//         >
//           <LayoutGrid size={20} />
//         </button>
//       </div>
//     </nav>
//   )
// }

// export default Navbar


















import React, { useEffect, useState } from "react";
import Image from "next/image";
import Profile from "@/public/dashboard/profile.png";
import SidebarIcon from "@/public/dashboard/sideFrame.png";
import Logo from "@/public/images/logo.png";
import Search from "@/public/dashboard/search.png";
import Link from "next/link";
import UserName from "../common/names/UserName";
import FirstName from "@/components/common/names/FirstName";
import X from "@/public/dashboard/xButton.png";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { pages } from "@/lib/pages";
import back from "@/public/SVGs/back.svg";
import MobileNav from "./dashboard/MobileNav";
import { CourseDataType, useUserCourses, useUserStore } from "@/state/store";
import { useUserProfileStore } from "@/state/user";
import { SearchIcon } from "lucide-react";
import { useOnboardingStore } from "@/state/useOnboardingData";

const mobileNavItems = [
  {
    text: "Home",
    logo: "/dashboard/homeWhite.png",
    altText: "Home",
    link: "/dashboard",
  },
  {
    text: "Journals",
    logo: "/dashboard/journalWhite.png",
    altText: "Journals",
    link: "/journals",
  },
  {
    text: "Courses",
    logo: "/dashboard/coursesWhite.png",
    altText: "Courses",
    link: "/courses",
  },
  {
    text: "Skills",
    logo: "/dashboard/skillWhite.png",
    altText: "Skills",
    link: "/skilltree",
  },
  {
    text: "Insights",
    logo: "/dashboard/insightswhite.png",
    altText: "Insights",
    link: "/insights",
  },
  {
    text: "Profile",
    logo: "/dashboard/profileWhite.png",
    altText: "Profile",
    link: "/profile",
  },
  {
    text: "Log Out",
    logo: "/dashboard/logoutWhite.png",
    altText: "Log Out",
    link: "",
  },
];

const Navbar = () => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter()
  const isDashboard = pathname.includes("/dashboard");
  const { name, setName, setProfilePic } = useUserStore()
  const { profile } = useUserProfileStore()
  const navbarPic = profile?.profile_picture_url || ''
  const currentPage = pages.find((page) => pathname.startsWith(page.href))?.name || "Home";
  const [target, setTarget] = useState('')
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  // const [searchResult, setSearchResult] = useState<CourseDataType[]>()
  const { setCourses} = useUserCourses()
    const {interests, skillLevel} = useOnboardingStore()
  console.log(currentPage);

  const parts = name.trim().split(/\s+/)
  const first = parts[0] || ''
  const firstName = first ? first.charAt(0).toUpperCase() : ''
  const second = parts[1] || ''
  const secondName = second ? second.charAt(0).toUpperCase() : ''

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://34.228.198.154/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;

        const data = await res.json();
        setName(data.full_name || '')
        setProfilePic(data.profile_picture_url || '')
      } catch (err) {
        console.error("fetch user failed:", err);
      }
    };
    fetchData()
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!target.trim()) {
      const res = await fetch('https://nuroki-backend.onrender.com/outrecommendall/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interest: interests }),
      })
      const data = await res.json()
      setCourses(data.courses || [])
      return
    }
    try {
      const res = await fetch('https://nuroki-backend.onrender.com/search/', {
        method: 'POST',
        headers: {
          // Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({query: target})
      })
      const data = await res.json()
      setCourses(data.courses || [])
    } catch (err) {
      console.log(err)
    }
  }

//   useEffect(() => {
//   if (target === "") return
// }, [target]);


  return (
    <main style={{ fontFamily: "var(--font-nunito), sans-serif" }}>
      <nav className=' select-none  top-0 px-3 md:pr-8 bg-white md:py-[1%] md:border-b md:border-gray-600"'>
        <div className="flex justify-between md:justify-start items-center">
          <div className="hidden md:flex  w-[8%] justify-center">
            <Image src={Logo} width={49} height={49} alt="" />
          </div>
          <div className="hidden md:block pl-2">
            <p className={`text-[24px] w-full whitespace-nowrap`}>{currentPage}</p>
          </div>
          <section className={`${isDashboard ? 'flex' : 'block'} justify-between w-full items-center`}>
            <div className={`flex justify-between w-full md:justify-end items-center ${isDashboard ? 'py-4' : ' py-0 '} md:py-0`}>
              <section className="md:flex items-center gap-6">

                {/* <div className={`${ currentPage === 'Courses' ? 'block' : 'hidden'}`} onClick={handleSearch}>
                    <Image src={Search} alt="" className="hover:cursor-pointer" />
                  </div> */}

                <div className={`flex items-center gap-3 flex-1 justify-end ${ currentPage === 'Courses' ? 'md:block' : 'hidden'}`}>
                  {/* Inline expanding search */}
                  <AnimatePresence initial={false}>
                    {searchOpen ? (
                      <motion.form
                        key="searchbar"
                        onSubmit={handleSearch}
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 250, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-2 overflow-hidden bg-gray-100 rounded-lg px-3 py-2"
                      >
                        <input
                          type="text"
                          placeholder="Search courses..."
                          value={target}
                          onChange={(e) => setTarget(e.target.value)}
                          className="flex-1 bg-transparent text-[#212121] placeholder-gray-400 outline-none"
                        />
                        <button type="submit" aria-label="Submit search" className="hover:cursor-pointer">
                          <SearchIcon size={18} />
                        </button>
                      </motion.form>
                    ) : (
                      <button
                        key="searchicon"
                        onClick={() => setSearchOpen(true)}
                        className="p-2 rounded-full hover:cursor-pointer hover:scale-120"
                        aria-label="Open search"
                      >
                        <SearchIcon size={20} className="text-[#4A4A4A]"/>
                      </button>
                    )}
                  </AnimatePresence>
                  </div>

                  <section className={`${isDashboard ? 'flex' : ' hidden md:flex'}  gap-2 md:gap-4 items-center`}>
                    {(navbarPic ?? '') === '' ? (
                      <div className={`flex w-12 h-12 rounded-full bg-[#EBFFFC] text-[#00BFA5] font-semibold text-[14px] lg:text-[20px] justify-center items-center `}>
                        {/* <Image src={Profile} width={48} alt="Profile picture" /> */}
                        <p>{firstName}<span className=" hidden lg:inline-block">{secondName}</span></p>
                      </div>
                    ) : (
                      <div className="">
                        <Image src={navbarPic} width={100} height={100} alt="Profile picture" className="rounded-full w-12 h-12 object-cover" />
                      </div>
                    )}
                    {isDashboard && (
                      <div className="md:hidden">
                        <p className="text-[20px] font-bold">
                          Hello, <FirstName />!
                        </p>
                        <p className="text-[14px] text-[#4A4A4A]">
                          Here's to steady growth.
                        </p>
                      </div>
                    )}
                    <div className="hidden md:block">
                      <p className="text-[24px] font-bold">
                        <UserName />
                      </p>
                      {/* <p className="text-[18px] text-[#4A4A4A]">Admin</p> */}
                    </div>
                  </section>
              </section>
              {isDashboard && (
                <div
                  className="block md:hidden cursor-pointer"
                  onClick={() => setIsClicked(true)}
                >
                  <Image src={SidebarIcon} width={24} height={24} alt="menu" />
                </div>
              )}
            </div>
            {!isDashboard && (
              <div className="flex justify-between items-center w-full md:hidden py-4">
                <div className="w-[10px] h-[10px]" onClick={() => router.back()}>
                  <Image src={back} alt="back" width={20} height={20} />
                </div>
                <p className="font-[500] text-[24px]">{currentPage}</p>
                <div
                  className="block md:hidden cursor-pointer"
                  onClick={() => setIsClicked(true)}
                >
                  <Image src={SidebarIcon} width={24} height={24} alt="menu" />
                </div>
              </div>
            )}
          </section>
        </div>
      </nav>

      <AnimatePresence>
        {isClicked && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
            className="fixed inset-0 z-50"
          >
            <nav className=" flex flex-col md:hidden gap-[10%] p-6 pt-10 w-screen h-screen bg-[#005C4D]">
              <div className="pl-2" onClick={() => setIsClicked(false)}>
                <Image src={X} alt="Navbar" />
              </div>
              <section className="flex flex-col gap-10 items-cent h-full text-white">
                {mobileNavItems.map((item, idx) => (
                  <div onClick={() => setIsClicked(false)} key={idx}>
                    <Link href={item.link}>
                      <div className="flex  gap-3 items-center justify-cente ">
                        <Image
                          src={`${item.logo}`}
                          width={32}
                          height={32}
                          alt={item.altText}
                        />
                        <p className="text-[24px] ">{item.text}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </section>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Navbar;














