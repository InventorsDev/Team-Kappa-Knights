"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useUserStore } from "@/state/store"
import { useUserProfileStore } from "@/state/user"
import { useRouter } from "next/navigation"

const CLOUD_NAME = "dexchhhbs" 
const UPLOAD_PRESET = "nextjs_profile_upload" 

const Photo = () => {
  //const [image, setImage] = useState<string | null>(null)
  const {setProfilePicture, profile} = useUserProfileStore()
  const [loading, setLoading] = useState(false)
  // const {profilePic, setProfilePic} = useUserStore()
  const router = useRouter()
  console.log(profile)

  // Save the new profile picture URL to your backend
  const toggleEdit = async (newUrl: string) => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://34.228.198.154/api/user/me", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profile_picture_url: newUrl,
          }),
        });
        if (!res.ok) {
          console.error("save failed:", await res.text());
        }
      } catch (err) {
        console.error("save failed:", err);
      }
    };


  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", UPLOAD_PRESET)

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      )

      const data = await res.json()
      const newUrl: string | undefined = data?.secure_url
      if (!newUrl) {
        throw new Error("Cloudinary response missing secure_url")
      }
      // Update local store and persist to backend with the same URL
      setProfilePicture(newUrl)
      await toggleEdit(newUrl)
      // setProfilePic(data.profile_picture_url || "");
    } catch (err) {
      console.error("Upload failed:", err)
    } finally {
      setLoading(false)
    }
  }
  // localStorage.setItem('profilepic', profilePic)
  if(!profile){
    router.push("/")
  }
console.log(profile)


  return (
    <main className="flex flex-col items-center justify-center pt-5">
      <div className="pb-2 w-[160px] h-[160px] overflow-hidden relative rounded-full">
        <Image
          // key={pr || "default"}
          // src={profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
          src={profile?.profile_picture_url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
          // src={"https://res.cloudinary.com/dexchhhbs/image/upload/v1757383063/tsjojyzrh1fuw2qmm615.jpg"}
          fill
          alt="Profile Pic"
          className=" object-cover"
        />
      </div>

      <label htmlFor="file-upload">
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
        <Button asChild variant="outline" className="text-[#00BFA5] font-semibold">
          <span>{loading ? "Uploading..." : "Change Photo"}</span>
        </Button>
      </label>
    </main>
  )
}

export default Photo





// import React from 'react'
// import Image from 'next/image'
// import Pic from '@/public/dashboard/profile.png'

// const Photo = () => {
//   return (
//     <main className='flex flex-col items-center justify-center pt-5'>
//         <div className='pb-2'>
//             <Image src={Pic} width={120} height={120} alt='Profile Pic' className='md:w-[160px] md:h-[160px]'/>
//         </div>
//         <p className='hover:cursor-pointer text-[#00BFA5] text-[18px] font-semibold md:text-[18px]'>Change Photo</p>
//     </main>
//   )
// }

// export default Photo


















// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { profile } from "console";
// import { useUserStore } from "@/state/store";
// import { useUserProfileStore } from "@/state/user";

// const CLOUD_NAME = "dexchhhbs";
// const UPLOAD_PRESET = "nextjs_profile_upload";

// const Photo = () => {
//   //const [image, setImage] = useState<string | null>(null)
//   const [loading, setLoading] = useState(false);
//   const { name, profilePic, setProfilePic } = useUserStore();
//   const { setProfilePicture, profile } = useUserProfileStore();

//   const parts = name.trim().split(/\s+/);
//   const first = parts[0] || "";
//   const firstName = first ? first.charAt(0).toUpperCase() : "";
//   const second = parts[1] || "";
//   const secondName = second ? second.charAt(0).toUpperCase() : "";

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     const token = localStorage.getItem("token");
//   //     if (!token) return;

//   //     try {
//   //       const res = await fetch("http://34.228.198.154/api/user/me", {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       });
//   //       if (!res.ok) return;

//   //       const data = await res.json();

//   //       setProfilePicture(data.profile_picture_url);
//   //     } catch (err) {
//   //       console.error("fetch user failed:", err);
//   //     }
//   //   };

//   //   fetchData();
//   // }, [setProfilePicture]);

//   const toggleEdit = async () => {
//     const token = localStorage.getItem("token");

//     try {
//       await fetch("http://34.228.198.154/api/user/me", {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           profile_picture_url: profile?.profile_picture_url,
//         }),
//       });
//     } catch (err) {
//       console.error("save failed:", err);
//     }
//   };

//   //   const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   const file = e.target.files?.[0];
//   //   if (!file) return;

//   //   const token = localStorage.getItem("token");
//   //   const formData = new FormData();
//   //   formData.append("profile_picture", file);

//   //   try {
//   //     const res = await fetch("http://34.228.198.154/api/user/me", {
//   //       method: "PUT",
//   //       headers: {
//   //         Authorization: `Bearer ${token}`,
//   //         // don’t set Content-Type, browser handles it for FormData
//   //       },
//   //       body: formData,
//   //     });

//   //     const data = await res.json();
//   //     // backend should give updated profile back
//   //     setProfilePicture(data.profile.profile_picture_url);
//   //   } catch (err) {
//   //     console.error("Upload failed:", err);
//   //   }
//   // };


//   const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setLoading(true);

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", UPLOAD_PRESET);

//     try {
//       const res = await fetch(
//         `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       const data = await res.json();
//       console.log(data)
//       setProfilePicture(data.secure_url) // updates Zustand + persists
// // await toggleEdit() // saves to backend

//       console.log(profile?.profile_picture_url)
//       await toggleEdit();
//       //setProfilePic(data.profile_picture_url || "");
//     } catch (err) {
//       console.error("Upload failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   //localStorage.setItem('profilepic', profilePic)

//   return (
//     <main className="flex flex-col items-center justify-center pt-5">
//       {profilePic ? (
//         <div className="pb-2 w-[160px] h-[160px] overflow-hidden relative rounded-full">
//           <Image
//             src={
//               profile?.profile_picture_url ||
//               "https://cdn-icons-png.flaticon.com/512/149/149071.png"
//             }
//             fill
//             alt="Profile Pic"
//             className="object-cover"
//           />

//         </div>
//       ) : (
//         <div className="w-40 h-40 rounded-full bg-[#EBFFFC] text-[#00BFA5] font-semibold text-[40px] flex justify-center items-center">
//           {/* <Image src={Profile} width={48} alt="Profile picture" /> */}
//           <p>
//             {firstName}
//             {secondName}
//           </p>
//         </div>
//       )}

//       <label htmlFor="file-upload">
//         <input
//           id="file-upload"
//           type="file"
//           accept="image/*"
//           className="hidden"
//           onChange={handleUpload}
//         />
//         <Button
//           asChild
//           variant="outline"
//           className="text-[#00BFA5] font-semibold mt-3"
//         >
//           <span>{loading ? "Uploading..." : "Change Photo"}</span>
//         </Button>
//       </label>
//     </main>
//   );
// };

// export default Photo;












// "use client"

// import React, { useEffect, useState } from "react"
// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import { useUserProfileStore } from "@/state/user"
// import { useRouter } from "next/navigation"

// const CLOUD_NAME = "dexchhhbs" 
// const UPLOAD_PRESET = "nextjs_profile_upload" 

// const Photo = () => {
//   //const [image, setImage] = useState<string | null>(null)
//   const {setProfilePicture, profile} = useUserProfileStore()
//   const [loading, setLoading] = useState(false)
//   // const {profilePic, setProfilePic} = useUserStore()
//   const router = useRouter()

//   const toggleEdit = async () => {
//       const token = localStorage.getItem("token");

//       try {
//         await fetch("http://34.228.198.154/api/user/me", {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             profile_picture_url: profile?.profile_picture_url
//           }),
//         });
//       } catch (err) {
//         console.error("save failed:", err);
//       }
//     };


//   const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (!file) return

//     setLoading(true)

//     const formData = new FormData()
//     formData.append("file", file)
//     formData.append("upload_preset", UPLOAD_PRESET)

//     try {
//       const res = await fetch(
//         `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       )

//       const data = await res.json()
//       setProfilePicture(data.secure_url) 
//       await toggleEdit()
//       // setProfilePic(data.profile_picture_url || "");
//     } catch (err) {
//       console.error("Upload failed:", err)
//     } finally {
//       setLoading(false)
//     }
//   }
//   // localStorage.setItem('profilepic', profilePic)
//   if(!profile){
//     router.push("/")
//   }
// console.log(profile)


//   return (
//     <main className="flex flex-col items-center justify-center pt-5">
//       <div className="pb-2 w-[160px] h-[160px] overflow-hidden relative rounded-full">
//         <Image
//           // key={pr || "default"}
//           // src={profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
//           src={profile?.profile_picture_url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
//           // src={"https://res.cloudinary.com/dexchhhbs/image/upload/v1757383063/tsjojyzrh1fuw2qmm615.jpg"}
//           fill
//           alt="Profile Pic"
//           className=" object-cover"
//         />
//       </div>

//       <label htmlFor="file-upload">
//         <input
//           id="file-upload"
//           type="file"
//           accept="image/*"
//           className="hidden"
//           onChange={handleUpload}
//         />
//         <Button asChild variant="outline" className="text-[#00BFA5] font-semibold">
//           <span>{loading ? "Uploading..." : "Change Photo"}</span>
//         </Button>
//       </label>
//     </main>
//   )
// }

// export default Photo





// import React from 'react'
// import Image from 'next/image'
// import Pic from '@/public/dashboard/profile.png'

// const Photo = () => {
//   return (
//     <main className='flex flex-col items-center justify-center pt-5'>
//         <div className='pb-2'>
//             <Image src={Pic} width={120} height={120} alt='Profile Pic' className='md:w-[160px] md:h-[160px]'/>
//         </div>
//         <p className='hover:cursor-pointer text-[#00BFA5] text-[18px] font-semibold md:text-[18px]'>Change Photo</p>
//     </main>
//   )
// }

// export default Photo


















// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { profile } from "console";
// import { useUserStore } from "@/state/store";
// import { useUserProfileStore } from "@/state/user";

// const CLOUD_NAME = "dexchhhbs";
// const UPLOAD_PRESET = "nextjs_profile_upload";

// const Photo = () => {
//   //const [image, setImage] = useState<string | null>(null)
//   const [loading, setLoading] = useState(false);
//   const { name, profilePic, setProfilePic } = useUserStore();
//   const { setProfilePicture, profile } = useUserProfileStore();

//   const parts = name.trim().split(/\s+/);
//   const first = parts[0] || "";
//   const firstName = first ? first.charAt(0).toUpperCase() : "";
//   const second = parts[1] || "";
//   const secondName = second ? second.charAt(0).toUpperCase() : "";

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     const token = localStorage.getItem("token");
//   //     if (!token) return;

//   //     try {
//   //       const res = await fetch("http://34.228.198.154/api/user/me", {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       });
//   //       if (!res.ok) return;

//   //       const data = await res.json();

//   //       setProfilePicture(data.profile_picture_url);
//   //     } catch (err) {
//   //       console.error("fetch user failed:", err);
//   //     }
//   //   };

//   //   fetchData();
//   // }, [setProfilePicture]);

//   const toggleEdit = async () => {
//     const token = localStorage.getItem("token");

//     try {
//       await fetch("http://34.228.198.154/api/user/me", {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           profile_picture_url: profile?.profile_picture_url,
//         }),
//       });
//     } catch (err) {
//       console.error("save failed:", err);
//     }
//   };

//   //   const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   const file = e.target.files?.[0];
//   //   if (!file) return;

//   //   const token = localStorage.getItem("token");
//   //   const formData = new FormData();
//   //   formData.append("profile_picture", file);

//   //   try {
//   //     const res = await fetch("http://34.228.198.154/api/user/me", {
//   //       method: "PUT",
//   //       headers: {
//   //         Authorization: `Bearer ${token}`,
//   //         // don’t set Content-Type, browser handles it for FormData
//   //       },
//   //       body: formData,
//   //     });

//   //     const data = await res.json();
//   //     // backend should give updated profile back
//   //     setProfilePicture(data.profile.profile_picture_url);
//   //   } catch (err) {
//   //     console.error("Upload failed:", err);
//   //   }
//   // };


//   const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setLoading(true);

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", UPLOAD_PRESET);

//     try {
//       const res = await fetch(
//         `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       const data = await res.json();
//       console.log(data)
//       setProfilePicture(data.secure_url) // updates Zustand + persists
// // await toggleEdit() // saves to backend

//       console.log(profile?.profile_picture_url)
//       await toggleEdit();
//       //setProfilePic(data.profile_picture_url || "");
//     } catch (err) {
//       console.error("Upload failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   //localStorage.setItem('profilepic', profilePic)

//   return (
//     <main className="flex flex-col items-center justify-center pt-5">
//       {profilePic ? (
//         <div className="pb-2 w-[160px] h-[160px] overflow-hidden relative rounded-full">
//           <Image
//             src={
//               profile?.profile_picture_url ||
//               "https://cdn-icons-png.flaticon.com/512/149/149071.png"
//             }
//             fill
//             alt="Profile Pic"
//             className="object-cover"
//           />

//         </div>
//       ) : (
//         <div className="w-40 h-40 rounded-full bg-[#EBFFFC] text-[#00BFA5] font-semibold text-[40px] flex justify-center items-center">
//           {/* <Image src={Profile} width={48} alt="Profile picture" /> */}
//           <p>
//             {firstName}
//             {secondName}
//           </p>
//         </div>
//       )}

//       <label htmlFor="file-upload">
//         <input
//           id="file-upload"
//           type="file"
//           accept="image/*"
//           className="hidden"
//           onChange={handleUpload}
//         />
//         <Button
//           asChild
//           variant="outline"
//           className="text-[#00BFA5] font-semibold mt-3"
//         >
//           <span>{loading ? "Uploading..." : "Change Photo"}</span>
//         </Button>
//       </label>
//     </main>
//   );
// };

// export default Photo;
