"use client";
import React, { useState, useEffect } from "react";
import { useUserStore } from "@/state/store";
import Image from "next/image";
import LogOut from "@/public/dashboard/logOutBig.png";
import Back from "@/public/dashboard/xButtonBlack.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const months = [
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
];

const PersonalInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const router = useRouter();

  const {
    name,
    setName,
    email,
    setEmail,
    gender,
    setGender,
    dob,
    setDob,
    profilePic,
    setProfilePic,
  } = useUserStore();

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
        //setProfilePic(data.profile_picture_url || "")

        // hydrate dob
        if (data.date_of_birth) {
          const [year, monthIdx, day] = data.date_of_birth.split("-");
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

  const toggleEdit = async () => {
    if (isEditing) {
      const token = localStorage.getItem("token");

      const monthNum = months.indexOf(dob.month) + 1;
      const iso =
        dob.year && dob.month && dob.day
          ? `${dob.year}-${String(monthNum).padStart(
              2,
              "0"
            )}-${dob.day.padStart(2, "0")}`
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
            date_of_birth: iso,
            profile_picture_url: profilePic,
          }),
        });
      } catch (err) {
        console.error("save failed:", err);
      }
    }
    setIsEditing((v) => !v);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch("http://34.228.198.154/api/user/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      localStorage.setItem("token", "");
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="md:border rounded-2xl md:p-7 md:mt-8 select-none">
      {/* log out modal */}
      {isClicked && (
        <section className="fixed inset-0 z-50 flex justify-center items-center bg-black/60">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg">
            <div className="flex w-full justify-end">
              <button
                onClick={() => setIsClicked(false)}
                className="p-1 hover:cursor-pointer"
              >
                {}
                <Image src={Back} alt="Exit" width={10} height={10} />
              </button>
            </div>
            <section className="flex flex-col justify-center items-center text-center pt-6">
              <Image src={LogOut} alt="Log Out" width={60} height={60} />
              <p className="text-[24px] font-bold">Log Out</p>
              <p className="text-[#4A4A4A] pb-8">
                Are you sure you want to log out?
              </p>
              <section className="flex flex-col gap-2 w-full">
                <button
                  onClick={() => setIsClicked(false)}
                  className=" bg-[#FF6665] rounded-xl py-3 text-white font-semibold hover:cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-[#FFF3F3] rounded-xl py-3  font-semibold hover:cursor-pointer"
                >
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
            <label className="w-32 md:text-[16px] md:font-semibold">
              Full Name
            </label>
            {isEditing ? (
              <input
                title="name"
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
            <label className="w-32 md:text-[16px] md:font-semibold">
              Email
            </label>
            {isEditing ? (
              <input
                title="email"
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
            <div className="md:py-4 p-2 rounded-lg border border-[#CCCCCC] flex-1">
              {email}
            </div>
          </div>

          {/* Gender */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label className="w-32 md:text-[16px] md:font-semibold">
              Gender
            </label>
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
            <label className="md:text-[16px] md:font-semibold">
              Date of Birth
            </label>
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
