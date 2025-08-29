"use client"

import React, { useState } from "react"
import Photo from "./Photo"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const PersonalInfo = () => {
  const [isEditing, setIsEditing] = useState(false)

  const [userInfo, setUserInfo] = useState({
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@email.com",
    gender: "Female",
    dob: { day: "31", month: "January", year: "2005" },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserInfo((prev) => ({ ...prev, [name]: value }))
  }

  const toggleEdit = () => {
    if (isEditing) {
      console.log("Saving:", userInfo)
    }
    setIsEditing((prev) => !prev)
  }

  return (
    <main className="md:border rounded-2xl md:p-7 md:mt-8 select-none">
      <div className="pb-5">
        <p className="text-[18px] md:text-[24px] font-bold">Personal Information</p>
        <p className="text-[15px] md:text-[18px] text-[#4A4A4A]">
          Update your profile details and personal information
        </p>
      </div>

      <section className="md:flex gap-10 md:pt-5">
        <div className="md:inline-block hidden w-[30%]">
          <Photo />
        </div>

        {/* The personal info form */}
        <form className="space-y-5 w-full">
          {/* First Name */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label className="md:flex-2 md:text-[16px] md:font-semibold">First Name</label>
            {isEditing ? (
              <input
                type="text"
                name="firstName"
                value={userInfo.firstName}
                onChange={handleChange}
                className="md:flex-7 md:py-4 p-2 rounded-lg border border-[#CCCCCC]"
              />
            ) : (
              <div className="md:flex-7 md:py-4 p-2 rounded-lg border border-[#CCCCCC]">
                {userInfo.firstName}
              </div>
            )}
          </div>

          {/* Last Name */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label className="md:flex-2 md:text-[16px] md:font-semibold">Last Name</label>
            {isEditing ? (
              <input
                type="text"
                name="lastName"
                value={userInfo.lastName}
                onChange={handleChange}
                className="md:flex-7 md:py-4 p-2 rounded-lg border border-[#CCCCCC]"
              />
            ) : (
              <div className="md:flex-7 md:py-4 p-2 rounded-lg border border-[#CCCCCC]">
                {userInfo.lastName}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label className="md:flex-2 md:text-[16px] md:font-semibold">Email Address</label>
            {isEditing ? (
              <input
                type="text"
                name="email"
                value={userInfo.email}
                onChange={handleChange}
                className="md:flex-7 md:py-4 p-2 rounded-lg border border-[#CCCCCC]"
              />
            ) : (
              <div className="md:flex-7 md:py-4 p-2 rounded-lg border border-[#CCCCCC]">
                {userInfo.email}
              </div>
            )}
          </div>

          {/* Gender */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label className="md:flex-2 md:text-[16px] md:font-semibold">Gender</label>
            {isEditing ? (
              <Select
                onValueChange={(val) =>
                  setUserInfo((prev) => ({ ...prev, gender: val }))
                }
                defaultValue={userInfo.gender}
              >
                <SelectTrigger className="md:flex-7 md:py-7 p-2 rounded-lg border border-[#CCCCCC]">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="md:flex-7 md:py-4 p-2 rounded-lg border border-[#CCCCCC]">
                {userInfo.gender}
              </div>
            )}
          </div>

          {/* Date of Birth */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label className="md:flex-2 md:text-[16px] md:font-semibold">Date of Birth</label>
            {isEditing ? (
              <section className="md:flex-7 flex justify-between gap-3 ">
                {/* Day */}
                <Select
                  onValueChange={(val) =>
                    setUserInfo((prev) => ({
                      ...prev,
                      dob: { ...prev.dob, day: val },
                    }))
                  }
                  defaultValue={userInfo.dob.day}
                >
                  <SelectTrigger className="flex-1 md:py-6 p-2 rounded-lg border border-[#CCCCCC]">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => (
                      <SelectItem key={i} value={`${i + 1}`}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Month */}
                <Select
                  onValueChange={(val) =>
                    setUserInfo((prev) => ({
                      ...prev,
                      dob: { ...prev.dob, month: val },
                    }))
                  }
                  defaultValue={userInfo.dob.month}
                >
                  <SelectTrigger className="flex-1 md:py-6 p-2 rounded-lg border border-[#CCCCCC]">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ].map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Year */}
                <Select
                  onValueChange={(val) =>
                    setUserInfo((prev) => ({
                      ...prev,
                      dob: { ...prev.dob, year: val },
                    }))
                  }
                  defaultValue={userInfo.dob.year}
                >
                  <SelectTrigger className="flex-1 md:py-6 p-2 rounded-lg border border-[#CCCCCC]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 100 }, (_, i) => {
                      const year = 2025 - i
                      return (
                        <SelectItem key={year} value={`${year}`}>
                          {year}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </section>
            ) : (
              <section className="md:flex-7 flex justify-between gap-3">
                <div className="flex-1 md:py-4 p-2 rounded-lg border border-[#CCCCCC]">
                  {userInfo.dob.day}
                </div>
                <div className="flex-1 md:py-4 p-2 rounded-lg border border-[#CCCCCC]">
                  {userInfo.dob.month}
                </div>
                <div className="flex-1 md:py-4 p-2 rounded-lg border border-[#CCCCCC]">
                  {userInfo.dob.year}
                </div>
              </section>
            )}
          </div>

          {/* Buttons */}
          <div className="flex md:justify-end w-full">
            <div className="flex md:justify-end w-full md:w-[50%] gap-3 pt-3">
              <button
                type="button"
                className="bg-[#FF6665] flex-1 rounded-lg text-center md:px-5 py-3 text-white font-bold"
              >
                Log Out
              </button>
              <button
                type="button"
                onClick={toggleEdit}
                className="bg-[#00B5A5] flex-1 rounded-lg text-center md:px-5 py-3 text-white font-bold"
              >
                {isEditing ? "Save Changes" : "Make Changes"}
              </button>
            </div>
          </div>

          <hr className="border border-[#CCCCCC] w-full mt-8 md:hidden" />
        </form>
      </section>
    </main>
  )
}

export default PersonalInfo












// import React from 'react'
// import Image from 'next/image'
// import DropDown from '@/public/dashboard/downArrow.png'
// import Photo from './Photo'

// const PersonalInfo = () => {
//   return (
//     <main className='md:border rounded-2xl md:p-7 md:mt-8 select-none'>
//         <div className='pb-5'>
//             <p className='text-[18px] md:text-[24px] font-bold'>Personal Information</p>
//             <p className='text-[15px] md:text-[18px] text-[#4A4A4A]'>Update your profile details and personal information</p>
//         </div>

//         <section className='md:flex gap-10 md:pt-5'>
//             <div className='md:inline-block hidden w-[30%]'>
//             <Photo />
//             </div>

//             {/* {The personal info form} */}

//              <form className='space-y-5 w-full'>
//             <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-2'>
//                 <label className='md:flex-2 md:text-[16px] md:font-semibold'>First Name</label>
//                 <input type='text' name='FirstName' className='md:flex-7 md:py-4 p-2 rounded-lg border border-[#CCCCCC]' />
//             </div>
//             <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-2'>
//                 <label className='md:flex-2 md:text-[16px] md:font-semibold'>Last Name</label>
//                 <input type='text' name='LastName' className='md:flex-7 md:py-4 p-2 rounded-lg border border-[#CCCCCC]' />
//             </div>
//             <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-2'>
//                 <label className='md:flex-2 md:text-[16px] md:font-semibold'>Email Address</label>
//                 <input type='text' name='EmailAddress' className='md:flex-7 md:py-4 p-2 rounded-lg border border-[#CCCCCC]' />
//             </div>
//             <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-2'>
//                 <label className='md:flex-2 md:text-[16px] md:font-semibold'>Gender</label>
//                 <div className='md:flex-7 md:py-4 flex justify-between items-center px-3 py-2  rounded-lg border border-[#CCCCCC]'>
//                     <p>Female</p>
//                     <div>
//                         <Image src={DropDown} alt=''/>
//                     </div>
//                 </div>
//             </div>
//             <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-2'>
//                 <label className='font-medium md:flex-2 md:text-[16px] md:font-semibold'>Date of Birth</label>
//                 <section className='md:flex-7 flex justify-between gap-3 '>
//                 <div className='flex-1 md:py-4 flex justify-between items-center px-3 py-2  rounded-lg border border-[#CCCCCC]'>
//                     <p>31</p>
//                     <div>
//                         <Image src={DropDown} alt=''/>
//                     </div>
//                 </div>
//                 <div className='flex-1 md:py-4 flex justify-between items-center px-3 py-2  rounded-lg border border-[#CCCCCC]'>
//                     <p>January</p>
//                     <div>
//                         <Image src={DropDown} alt=''/>
//                     </div>
//                 </div>
//                 <div className='flex-1 md:py-4 flex justify-between items-center px-3 py-2  rounded-lg border border-[#CCCCCC]'>
//                     <p>2005</p>
//                     <div>
//                         <Image src={DropDown} alt=''/>
//                     </div>
//                 </div>
//                 </section>
//             </div>

//             <div className=' flex md:justify-end w-full'>
//             <div className=' flex md:justify-end w-full md:w-[50%] gap-3 pt-3'>
//                 <button className='bg-[#FF6665] flex-1 rounded-lg text-center md:px-5 py-3 text-white font-bold'>Log Out</button>
//                 <button className='bg-[#00B5A5] flex-1 rounded-lg text-center md:px-5 py-3 text-white font-bold'>Make Changes</button>
//             </div>
//             </div>


//             <hr className='border border-[#CCCCCC] w-full mt-8 md:hidden'/>
//         </form>
//         </section>
       
//     </main>
//   )
// }

// export default PersonalInfo