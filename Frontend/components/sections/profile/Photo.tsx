"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const CLOUD_NAME = "dexchhhbs";
const UPLOAD_PRESET = "nextjs_profile_upload";

const Photo = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setImage(data.secure_url);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center gap-4">
      <div className="w-[160px] h-[160px] overflow-hidden relative rounded-full">
        {image ? (
          <Image
            key={image}
            src={image}
            fill
            alt="Profile Pic"
            className=" object-cover"
          />
        ) : (
          <Image
            key={"default"}
            src={"https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            fill
            alt="Profile Pic"
            className=" object-cover"
          />
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
        <Button
          asChild
          variant="outline"
          className="text-[#00BFA5] font-semibold"
        >
          <span>{loading ? "Uploading..." : "Change Photo"}</span>
        </Button>
      </label>
    </main>
  );
};

export default Photo;

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
