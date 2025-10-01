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
  const { name } = useUserStore()
  const [loading, setLoading] = useState(false)
  // const {profilePic, setProfilePic} = useUserStore()
  const router = useRouter()
  console.log(profile)
    const parts = name.trim().split(/\s+/);
  const first = parts[0] || "";
  const firstName = first ? first.charAt(0).toUpperCase() : "";
  const second = parts[1] || "";
  const secondName = second ? second.charAt(0).toUpperCase() : "";

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
        {/* <Image
          // key={pr || "default"}
          // src={profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
          src={profile?.profile_picture_url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
          // src={"https://res.cloudinary.com/dexchhhbs/image/upload/v1757383063/tsjojyzrh1fuw2qmm615.jpg"}
          fill
          alt="Profile Pic"
          className=" object-cover"
        /> */}

        
          { profile?.profile_picture_url ? (
           <Image src={profile?.profile_picture_url} fill alt="Profile picture" className="object-cover"/>
           ) : (
            <div className="w-40 h-40 rounded-full bg-[#EBFFFC] text-[#00BFA5] font-semibold text-[40px] flex justify-center items-center">
           <p>
         {firstName}
           {secondName}
         </p>
      </div>
        )}
       </div>

      <label htmlFor="file-upload">
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
        <Button asChild variant="default" className="text-[#00BFA5] font-semibold mt-2 hover:cursor-pointer">
          <span>{loading ? "Uploading..." : "Change Photo"}</span>
        </Button>
      </label>
    </main>
  )
}

export default Photo








