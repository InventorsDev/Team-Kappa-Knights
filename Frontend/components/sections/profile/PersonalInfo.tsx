'use client'
import React, { useState, useEffect } from "react";
import { useUserStore } from "@/state/store";
import Photo from "./Photo";
import Image from "next/image";
import Delete from "@/public/dashboard/deleteIcon.png";
import Back from "@/public/dashboard/xButtonBlack.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const PersonalInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isClicked, setIsClicked] = useState(false);


  const { name, setName, email, setEmail, gender, setGender, dob, setDob } =
    useUserStore();

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

      setName(data.full_name || "");
      setEmail(data.email || "");
      setGender(data.gender || "");

      // hydrate dob
      if (data.dob) {
        const [year, monthIdx, day] = data.dob.split("-");
        setDob({
          day,
          month: months[parseInt(monthIdx, 10) - 1] || "",
          year,
        });
      }

    } catch (err) {
      console.error("fetch user failed:", err);
    }
  };

  fetchData();
}, [setName, setEmail, setGender, setDob]);


  // fetch profile once
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const token = localStorage.getItem("token");
  //     if (!token) return;
  //     try {
  //       const res = await fetch("http://34.228.198.154/api/user/me", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       if (!res.ok) return;
  //       const data = await res.json();
  //       setName(data.full_name || "");
  //       setEmail(data.email || "");
  //       setGender(data.gender || "");
  //       if (data.dob) {
  //         const [year, monthIdx, day] = data.dob.split("-");
  //         setDob({
  //           day,
  //           month: months[parseInt(monthIdx, 10) - 1] || "",
  //           year,
  //         });
  //       }
  //     } catch (err) {
  //       console.error("fetch user failed:", err);
  //     }
  //   };
  //   fetchData();
  // }, [setName, setEmail, setGender, setDob]);

  const toggleEdit = async () => {
    if (isEditing) {
      const token = localStorage.getItem("token");

      const monthNum = months.indexOf(dob.month) + 1;
      const iso =
        dob.year && dob.month && dob.day
          ? `${dob.year}-${String(monthNum).padStart(2, "0")}-${dob.day.padStart(2, "0")}`
          : "";

      try {
        await fetch("http://34.228.198.154/api/user/me", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: name.trim(),
            email,
            gender,
            dob: iso,
          }),
        });
      } catch (err) {
        console.error("save failed:", err);
      }
    }
    setIsEditing((v) => !v);
  };
  localStorage.setItem('gender', gender)
  localStorage.setItem('dayob', dob.day)
  localStorage.setItem('monthob', dob.month)
  localStorage.setItem('yearob', dob.year)

  return (
    <main className="md:border rounded-2xl md:p-7 md:mt-8 select-none">
      {/* log out modal */}
      {isClicked && (
        <section className="fixed inset-0 z-50 flex justify-center items-center bg-black/60">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg">
            <div className="flex w-full justify-end">
              <button onClick={() => setIsClicked(false)} className="p-1">
                <Image src={Back} alt="Exit" width={10} height={10} />
              </button>
            </div>
            <section className="flex flex-col justify-center items-center text-center pt-6">
              <Image src={Delete} alt="Delete" width={60} height={60} />
              <p className="text-[24px] font-bold">Log Out</p>
              <p className="text-[#4A4A4A] pb-8">
                Are you sure you want to log out?
              </p>
              <section className="flex flex-col gap-2 w-full">
                <button className=" bg-[#FF6665] rounded-xl py-3 text-white font-semibold">
                  Don&apos;t Log Out
                </button>
                <button className="bg-[#EBFFFC] rounded-xl py-3  font-semibold">
                  Log Out
                </button>
              </section>
            </section>
          </div>
        </section>
      )}

      <div className="pb-5">
        <p className="text-[18px] md:text-[24px] font-bold">
          Personal Information
        </p>
        <p className="text-[15px] md:text-[18px] text-[#4A4A4A]">
          Update your profile details and personal information
        </p>
      </div>

      <section className="md:flex gap-10 md:pt-5">
        <form className="space-y-5 w-full">
          {/* Full Name */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label className="w-32 md:text-[16px] md:font-semibold">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="md:py-4 p-2 rounded-lg border border-[#CCCCCC] flex-1"
              />
            ) : (
              <div className="md:py-4 p-2 rounded-lg border border-[#CCCCCC] flex-1">
                {name}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label className="w-32 md:text-[16px] md:font-semibold">Email</label>
            {isEditing ? (
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="md:py-4 p-2 rounded-lg border border-[#CCCCCC] flex-1"
              />
            ) : (
              <div className="md:py-4 p-2 rounded-lg border border-[#CCCCCC] flex-1">
                {email}
              </div>
            )}
          </div>

          {/* Gender */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">

            <label className="w-32 md:text-[16px] md:font-semibold">Gender</label>
            {isEditing ? (
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="flex-1 md:py-7 p-2 rounded-lg border border-[#CCCCCC]">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className=" md:py-4 p-2 rounded-lg border border-[#CCCCCC] flex-1">
                {gender || "-"}
              </div>
            )}
          </div>

          {/* DOB */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-10">
            <label className="md:text-[16px] md:font-semibold">Date of Birth</label>
            {isEditing ? (
              <section className="flex flex-1 gap-3 md:w-32">
                {/* Day */}
                <Select
                  value={dob.day}
                  onValueChange={(val) => setDob({ ...dob, day: val })}
                >
                  <SelectTrigger className="flex-1 md:py-6 p-2 rounded-lg border border-[#CCCCCC]">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => (
                      <SelectItem key={i + 1} value={`${i + 1}`}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Month */}
                <Select
                  value={dob.month}
                  onValueChange={(val) => setDob({ ...dob, month: val })}
                >
                  <SelectTrigger className="flex-1 md:py-6 p-2 rounded-lg border border-[#CCCCCC]">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Year */}
                <Select
                  value={dob.year}
                  onValueChange={(val) => setDob({ ...dob, year: val })}
                >
                  <SelectTrigger className="flex-1 md:py-6 p-2 rounded-lg border border-[#CCCCCC]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 100 }, (_, i) => {
                      const year = 2025 - i;
                      return (
                        <SelectItem key={year} value={`${year}`}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </section>
            ) : (
              <section className="flex flex-1 gap-3 w-32">
                <div className="flex-1 md:py-4 p-2 rounded-lg border border-[#CCCCCC]">
                  {dob.day || "-"}
                </div>
                <div className="flex-1 md:py-4 p-2 rounded-lg border border-[#CCCCCC]">
                  {dob.month || "-"}
                </div>
                <div className="flex-1 md:py-4 p-2 rounded-lg border border-[#CCCCCC]">
                  {dob.year || "-"}
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
                onClick={() => setIsClicked(true)}
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
  );
};

export default PersonalInfo;














// "use client"

// import React, { useState, useEffect } from "react"
// import Photo from "./Photo"
// import Image from "next/image"
// import Delete from '@/public/dashboard/deleteIcon.png'
// import Back from '@/public/dashboard/xButtonBlack.png'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { useStore } from "zustand"
// import { useUserStore } from "@/state/store"

// type ApiUser = {
//   full_name?: string
//   email?: string
// }


// type UserInfo = {
//   fullName: string
//   email: string
//   gender: string
//   dob: { day: string; month: string; year: string }
// }

// const PersonalInfo = () => {
//   const [isEditing, setIsEditing] = useState(false)
//   const [isClicked, setIsClicked] = useState(false)
//   // const [userInfo, setUserInfo] = useState<UserInfo>({
//   //   fullName: "",
//   //   email: "",
//   //   gender: "",
//   //   dob: { day: "", month: "", year: "" },
//   // })
//   const {name, setName, email, setEmail, gender, setGender, } = useUserStore()

//   // fetch existing user profile once
//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem("token")
//       try {
//         const res = await fetch("http://34.228.198.154/api/user/me", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         })
//         if (!res.ok) return
//         const result: ApiUser = await res.json()
//           setUserInfo((prev) => ({
//             ...prev,
//             fullName: (result as any).full_name || "",   // pick full_name, not name
//             email: (result as any).email || "",
// }))
//       } catch (err) {
//         console.error("Error fetching user:", err)
//       }
//     }
//     fetchData()
//   }, [])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setUserInfo((prev) => ({ ...prev, [name]: value }))
//   }

//   const toggleEdit = async () => {
//     if (isEditing) {
//       const token = localStorage.getItem("token")
//       const payload = {
//         full_name: userInfo.fullName.trim(),
//         email: userInfo.email,
//       }

//       try {
//         const res = await fetch("http://34.228.198.154/api/user/me", {
//           method: "PATCH",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         })
//         if (!res.ok) console.error("Failed saving user:", await res.text())
//         else {
//           const saved = await res.json()
//           setUserInfo((prev) => ({
//             ...prev,
//             full_name: saved.name || prev.fullName,
//             email: saved.email || prev.email,
//           }))
//         }
//       } catch (err) {
//         console.error("Error saving user:", err)
//       }
//     }
//     setIsEditing((prev) => !prev)
//   }

//   return (
//     <main className="md:border rounded-2xl md:p-7 md:mt-8 select-none">
//       {isClicked && (
//               <section className="fixed inset-0 z-50 flex justify-center items-center bg-black/60">
//                 <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg">
//                   <div className="flex w-full justify-end">
//                     <button onClick={() => setIsClicked(false)} className="p-1">
//                       <Image src={Back} alt="Exit" width={10} height={10} />
//                     </button>
//                   </div>
//                   <section className="flex flex-col justify-center items-center text-center pt-6">
//                     <Image src={Delete} alt="Delete" width={60} height={60} />
//                     <p className="text-[24px] font-bold">Log Out</p>
//                     <p className="text-[#4A4A4A] pb-8">
//                       Are you sure you want to log out?
//                     </p>
//                     <section className="flex flex-col gap-2 w-full">
//                       <button className=" bg-[#FF6665] rounded-xl py-3 text-white font-semibold">
//                         Don&apos;t Log Out
//                       </button>
//                       <button className="bg-[#EBFFFC] rounded-xl py-3  font-semibold">
//                         Log Out
//                       </button>
//                     </section>
//                   </section>
//                 </div>
//               </section>
//             )}

//       <div className="pb-5">
//         <p className="text-[18px] md:text-[24px] font-bold">Personal Information</p>
//         <p className="text-[15px] md:text-[18px] text-[#4A4A4A]">
//           Update your profile details and personal information
//         </p>
//       </div>

//       <section className="md:flex gap-10 md:pt-5">
//         <div className="md:inline-block hidden w-[30%]">
//           <Photo />
//         </div>

//         <form className="space-y-5 w-full">
//           {/* Full Name */}
//           <div className="flex flex-col md:flex-row md:items-center gap-2">
//             <label className="md:flex-2 md:text-[16px] md:font-semibold">Full Name</label>
//             {isEditing ? (
//               <input
//                 type="text"
//                 name="fullName"
//                 value={userInfo.fullName}
//                 onChange={handleChange}
//                 className="md:flex-7 md:py-4 p-2 rounded-lg border border-[#CCCCCC]"
//               />
//             ) : (
//               <div className="md:flex-7 md:py-4 p-2 rounded-lg border border-[#CCCCCC]">
//                 {userInfo.fullName}
//               </div>
//             )}
//           </div>

//           {/* Email */}
//           <div className="flex flex-col md:flex-row md:items-center gap-2">
//             <label className="md:flex-2 md:text-[16px] md:font-semibold">Email Address</label>
//             {isEditing ? (
//               <input
//                 type="text"
//                 name="email"
//                 value={userInfo.email}
//                 onChange={handleChange}
//                 className="md:flex-7 md:py-4 p-2 rounded-lg border border-[#CCCCCC]"
//               />
//             ) : (
//               <div className="md:flex-7 md:py-4 p-2 rounded-lg border border-[#CCCCCC]">
//                 {userInfo.email}
//               </div>
//             )}
//           </div>

//           {/* Gender */}
//           <div className="flex flex-col md:flex-row md:items-center gap-2">
//             <label className="md:flex-2 md:text-[16px] md:font-semibold">Gender</label>
//             {isEditing ? (
//               <Select
//                 onValueChange={(val) =>
//                   setUserInfo((prev) => ({ ...prev, gender: val }))
//                 }
//                 defaultValue={userInfo.gender}
//               >
//                 <SelectTrigger className="md:flex-7 md:py-7 p-2 rounded-lg border border-[#CCCCCC]">
//                   <SelectValue placeholder="Select gender" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Male">Male</SelectItem>
//                   <SelectItem value="Female">Female</SelectItem>
//                   <SelectItem value="Other">Other</SelectItem>
//                 </SelectContent>
//               </Select>
//             ) : (
//               <div className="md:flex-7 md:py-4 p-2 rounded-lg border border-[#CCCCCC]">
//                 {userInfo.gender || "-"}
//               </div>
//             )}
//           </div>

//           {/* Date of Birth */}
//           <div className="flex flex-col md:flex-row md:items-center gap-2">
//             <label className="md:flex-2 md:text-[16px] md:font-semibold">Date of Birth</label>
//             {isEditing ? (
//               <section className="md:flex-7 flex justify-between gap-3">
//                 {/* Day */}
//                 <Select
//                   onValueChange={(val) =>
//                     setUserInfo((prev) => ({ ...prev, dob: { ...prev.dob, day: val } }))
//                   }
//                   defaultValue={userInfo.dob.day}
//                 >
//                   <SelectTrigger className="flex-1 md:py-6 p-2 rounded-lg border border-[#CCCCCC]">
//                     <SelectValue placeholder="Day" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {Array.from({ length: 31 }, (_, i) => (
//                       <SelectItem key={i} value={`${i + 1}`}>
//                         {i + 1}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 {/* Month */}
//                 <Select
//                   onValueChange={(val) =>
//                     setUserInfo((prev) => ({ ...prev, dob: { ...prev.dob, month: val } }))
//                   }
//                   defaultValue={userInfo.dob.month}
//                 >
//                   <SelectTrigger className="flex-1 md:py-6 p-2 rounded-lg border border-[#CCCCCC]">
//                     <SelectValue placeholder="Month" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {[
//                       "January","February","March","April","May","June",
//                       "July","August","September","October","November","December",
//                     ].map((m) => (
//                       <SelectItem key={m} value={m}>
//                         {m}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 {/* Year */}
//                 <Select
//                   onValueChange={(val) =>
//                     setUserInfo((prev) => ({ ...prev, dob: { ...prev.dob, year: val } }))
//                   }
//                   defaultValue={userInfo.dob.year}
//                 >
//                   <SelectTrigger className="flex-1 md:py-6 p-2 rounded-lg border border-[#CCCCCC]">
//                     <SelectValue placeholder="Year" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {Array.from({ length: 100 }, (_, i) => {
//                       const year = 2025 - i
//                       return (
//                         <SelectItem key={year} value={`${year}`}>
//                           {year}
//                         </SelectItem>
//                       )
//                     })}
//                   </SelectContent>
//                 </Select>
//               </section>
//             ) : (
//               <section className="md:flex-7 flex justify-between gap-3">
//                 <div className="flex-1 md:py-4 p-2 rounded-lg border border-[#CCCCCC]">
//                   {userInfo.dob.day || "-"}
//                 </div>
//                 <div className="flex-1 md:py-4 p-2 rounded-lg border border-[#CCCCCC]">
//                   {userInfo.dob.month || "-"}
//                 </div>
//                 <div className="flex-1 md:py-4 p-2 rounded-lg border border-[#CCCCCC]">
//                   {userInfo.dob.year || "-"}
//                 </div>
//               </section>
//             )}
//           </div>

//           {/* Buttons */}
//           <div className="flex md:justify-end w-full">
//             <div className="flex md:justify-end w-full md:w-[50%] gap-3 pt-3">
//               <button
//                 type="button"
//                 className="bg-[#FF6665] flex-1 rounded-lg text-center md:px-5 py-3 text-white font-bold"
//                 onClick={() => setIsClicked(true)}
//               >
//                 Log Out
//               </button>
//               <button
//                 type="button"
//                 onClick={toggleEdit}
//                 className="bg-[#00B5A5] flex-1 rounded-lg text-center md:px-5 py-3 text-white font-bold"
//               >
//                 {isEditing ? "Save Changes" : "Make Changes"}
//               </button>
//             </div>
//           </div>

//           <hr className="border border-[#CCCCCC] w-full mt-8 md:hidden" />
//         </form>
//       </section>
//     </main>
//   )
// }

// export default PersonalInfo








export default PersonalInfo;

// "use client"

// import React, { useState } from "react"
// import Photo from "./Photo"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"

// type DataType = {
//   name: string
//   lastname: string
//   email: string
// }

// const PersonalInfo = () => {
//   const [isEditing, setIsEditing] = useState(false)
//   const [data, setData] = useState<DataType>()

//   const [userInfo, setUserInfo] = useState({
//     firstName: "Jane",
//     lastName: "Doe",
//     email: "jane.doe@email.com",
//     gender: "Female",
//     dob: { day: "31", month: "January", year: "2005" },
//   })

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setUserInfo((prev) => ({ ...prev, [name]: value }))
//   }

//   const toggleEdit = () => {
//     if (isEditing) {
//       console.log("Saving:", userInfo)
//     }
//     setIsEditing((prev) => !prev)
//   }

//   const fetchData = async() => {
//     const token = localStorage.getItem('token')
//     try{
//       const res = await fetch('http://34.228.198.154/api/user/me', {
//         headers: {
//         "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json",}
//       })

//       const result = await res.json()
//       setData(result)
//     } catch{}
//   }

//   return (
//     <main className="md:border rounded-2xl md:p-7 md:mt-8 select-none">
//       <div className="pb-5">
//         <p className="text-[18px] md:text-[24px] font-bold">Personal Information</p>
//         <p className="text-[15px] md:text-[18px] text-[#4A4A4A]">
//           Update your profile details and personal information
//         </p>
//       </div>

//       <section className="md:flex gap-10 md:pt-5">
//         <div className="md:inline-block hidden w-[30%]">
//           <Photo />
//         </div>

//         {/* The personal info form */}
//         <form className="space-y-5 w-full">
//           {/* First Name */}
//           <div className="flex flex-col md:flex-row md:items-center gap-2">
//             <label className="md:flex-2 md:text-[16px] md:font-semibold">First Name</label>
//             {isEditing ? (
//               <input
//                 type="text"
//                 name="firstName"
//                 value={userInfo.firstName}
//                 onChange={handleChange}
//                 className="md:flex-7 md:py-4 p-2 rounded-lg border border-[#CCCCCC]"
//               />
//             ) : (
//               <div className="md:flex-7 md:py-4 p-2 rounded-lg border border-[#CCCCCC]">
//                 {data?.name}
//               </div>
//             )}
//           </div>

//           {/* Last Name */}
//           <div className="flex flex-col md:flex-row md:items-center gap-2">
//             <label className="md:flex-2 md:text-[16px] md:font-semibold">Last Name</label>
//             {isEditing ? (
//               <input
//                 type="text"
//                 name="lastName"
//                 value={userInfo.lastName}
//                 onChange={handleChange}
//                 className="md:flex-7 md:py-4 p-2 rounded-lg border border-[#CCCCCC]"
//               />
//             ) : (
//               <div className="md:flex-7 md:py-4 p-2 rounded-lg border border-[#CCCCCC]">
//                 {data?.lastname}
//               </div>
//             )}
//           </div>

//           {/* Email */}
//           <div className="flex flex-col md:flex-row md:items-center gap-2">
//             <label className="md:flex-2 md:text-[16px] md:font-semibold">Email Address</label>
//             {isEditing ? (
//               <input
//                 type="text"
//                 name="email"
//                 value={userInfo.email}
//                 onChange={handleChange}
//                 className="md:flex-7 md:py-4 p-2 rounded-lg border border-[#CCCCCC]"
//               />
//             ) : (
//               <div className="md:flex-7 md:py-4 p-2 rounded-lg border border-[#CCCCCC]">
//                 {data?.email}
//               </div>
//             )}
//           </div>

//           {/* Gender */}
//           <div className="flex flex-col md:flex-row md:items-center gap-2">
//             <label className="md:flex-2 md:text-[16px] md:font-semibold">Gender</label>
//             {isEditing ? (
//               <Select
//                 onValueChange={(val) =>
//                   setUserInfo((prev) => ({ ...prev, gender: val }))
//                 }
//                 defaultValue={userInfo.gender}
//               >
//                 <SelectTrigger className="md:flex-7 md:py-7 p-2 rounded-lg border border-[#CCCCCC]">
//                   <SelectValue placeholder="Select gender" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Male">Male</SelectItem>
//                   <SelectItem value="Female">Female</SelectItem>
//                   <SelectItem value="Other">Other</SelectItem>
//                 </SelectContent>
//               </Select>
//             ) : (
//               <div className="md:flex-7 md:py-4 p-2 rounded-lg border border-[#CCCCCC]">
//                 {userInfo.gender}
//               </div>
//             )}
//           </div>

//           {/* Date of Birth */}
//           <div className="flex flex-col md:flex-row md:items-center gap-2">
//             <label className="md:flex-2 md:text-[16px] md:font-semibold">Date of Birth</label>
//             {isEditing ? (
//               <section className="md:flex-7 flex justify-between gap-3 ">
//                 {/* Day */}
//                 <Select
//                   onValueChange={(val) =>
//                     setUserInfo((prev) => ({
//                       ...prev,
//                       dob: { ...prev.dob, day: val },
//                     }))
//                   }
//                   defaultValue={userInfo.dob.day}
//                 >
//                   <SelectTrigger className="flex-1 md:py-6 p-2 rounded-lg border border-[#CCCCCC]">
//                     <SelectValue placeholder="Day" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {Array.from({ length: 31 }, (_, i) => (
//                       <SelectItem key={i} value={`${i + 1}`}>
//                         {i + 1}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 {/* Month */}
//                 <Select
//                   onValueChange={(val) =>
//                     setUserInfo((prev) => ({
//                       ...prev,
//                       dob: { ...prev.dob, month: val },
//                     }))
//                   }
//                   defaultValue={userInfo.dob.month}
//                 >
//                   <SelectTrigger className="flex-1 md:py-6 p-2 rounded-lg border border-[#CCCCCC]">
//                     <SelectValue placeholder="Month" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {[
//                       "January",
//                       "February",
//                       "March",
//                       "April",
//                       "May",
//                       "June",
//                       "July",
//                       "August",
//                       "September",
//                       "October",
//                       "November",
//                       "December",
//                     ].map((m) => (
//                       <SelectItem key={m} value={m}>
//                         {m}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 {/* Year */}
//                 <Select
//                   onValueChange={(val) =>
//                     setUserInfo((prev) => ({
//                       ...prev,
//                       dob: { ...prev.dob, year: val },
//                     }))
//                   }
//                   defaultValue={userInfo.dob.year}
//                 >
//                   <SelectTrigger className="flex-1 md:py-6 p-2 rounded-lg border border-[#CCCCCC]">
//                     <SelectValue placeholder="Year" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {Array.from({ length: 100 }, (_, i) => {
//                       const year = 2025 - i
//                       return (
//                         <SelectItem key={year} value={`${year}`}>
//                           {year}
//                         </SelectItem>
//                       )
//                     })}
//                   </SelectContent>
//                 </Select>
//               </section>
//             ) : (
//               <section className="md:flex-7 flex justify-between gap-3">
//                 <div className="flex-1 md:py-4 p-2 rounded-lg border border-[#CCCCCC]">
//                   {userInfo.dob.day}
//                 </div>
//                 <div className="flex-1 md:py-4 p-2 rounded-lg border border-[#CCCCCC]">
//                   {userInfo.dob.month}
//                 </div>
//                 <div className="flex-1 md:py-4 p-2 rounded-lg border border-[#CCCCCC]">
//                   {userInfo.dob.year}
//                 </div>
//               </section>
//             )}
//           </div>

//           {/* Buttons */}
//           <div className="flex md:justify-end w-full">
//             <div className="flex md:justify-end w-full md:w-[50%] gap-3 pt-3">
//               <button
//                 type="button"
//                 className="bg-[#FF6665] flex-1 rounded-lg text-center md:px-5 py-3 text-white font-bold"
//               >
//                 Log Out
//               </button>
//               <button
//                 type="button"
//                 onClick={toggleEdit}
//                 className="bg-[#00B5A5] flex-1 rounded-lg text-center md:px-5 py-3 text-white font-bold"
//               >
//                 {isEditing ? "Save Changes" : "Make Changes"}
//               </button>
//             </div>
//           </div>

//           <hr className="border border-[#CCCCCC] w-full mt-8 md:hidden" />
//         </form>
//       </section>
//     </main>
//   )
// }

// export default PersonalInfo

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
