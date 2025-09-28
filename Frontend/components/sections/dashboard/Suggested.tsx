"use client";
import Loading from "@/app/loading";
import AuthButton from "@/components/common/button/Button";
import { CourseDataType, useUserStore } from "@/state/store";
import { useOnboardingStore } from "@/state/useOnboardingData";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

type suggestedType = {
  title: string;
  details: string;
  category: string;
  feature: string;
};



const Suggested = () => {
  const [suggested, setSuggested] = useState<suggestedType[]>([]);
  const [isRouting, setIsRouting] = useState<boolean>(false);
  const { courses, setCourses, selectedSkillLevel, selectedTags } = useUserStore()
    const {interests, skillLevel} = useOnboardingStore()

   useEffect(() => {
      const token = localStorage.getItem('token')
      const fetchCourses = async () => {
        try { console.log(selectedTags)
  
          const res = await fetch('https://nuroki-backend.onrender.com/outrecommendall/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              // skill_level: skillLevel,
              interest: interests,
            })
          })
  
          console.log(res)
           console.log('selected tags are:' + selectedTags)
          if (!res.ok) throw new Error('Failed to fetch courses')
            const returnedData = await res.json()
          const data: CourseDataType[] = returnedData.courses
        console.log(data)
          setCourses(data)

  
        } catch (err) {
          console.error(err)
        }
      }
      fetchCourses()
    }, [setCourses])
  
    const displayCourses = courses.length > 0 ? courses : []
        if (courses.length === 0) return <Loading /> 
        console.log(displayCourses)

  return (
    <main className="select-none">
      <p className="text-[18px] md:text-[24px] font-bold pb-8">
        Recommended for you
      </p>
      <section className="space-y-8 pb-10">
        {/* {suggested.map((item, index) => {
          const isGreen = index % 2 !== 0;
          return (
            <section
              key={index}
              className="border border-[#CCCCCCCC] w-full p-4 rounded-[16px] select-none"
            >
              <p className="text-[18px]  font-semibold ">{item.title}</p>
              <p className="text-[#4A4A4A] text-[16px]"> {item.details} </p>
              <div className="flex gap-3 pt-2 ">
                <div
                  className={`px-3 py-1 rounded-lg border md:text-[18px] ${
                    isGreen ? " border-[#AAF4E9] border-2" : "border-[#886CFF]"
                  }`}
                >
                  {item.category}
                </div>
                <div
                  className={`px-3 py-1 rounded-lg border md:text-[18px] ${
                    isGreen ? " border-[#AAF4E9] border-2" : "border-[#886CFF]"
                  }`}
                >
                  {item.feature}
                </div>
              </div>
            </section>
          );
        })} */}

         {courses.slice(0, 2).map((item, index) => {
          const isGreen = index % 2 !== 0;
          return (
            <section
              key={index}
              className="border border-[#CCCCCCCC] w-full p-4 rounded-[16px] select-none"
            >
              <Link href={item.course_url} >
              <p className="text-[18px]  font-semibold ">{item.title}</p>
              <p className="text-[#4A4A4A] text-[16px] line-clamp-2"> {item.description} </p>
              <div className="flex gap-3 pt-2 ">
                <div
                  className={`px-3 py-1 rounded-lg border md:text-[18px] ${
                    isGreen ? " border-[#AAF4E9] border-2" : "border-[#886CFF]"
                  }`}
                >
                  {item.difficulty}
                </div>
                <div
                  className={`px-3 py-1 rounded-lg border md:text-[18px] ${
                    isGreen ? " border-[#AAF4E9] border-2" : "border-[#886CFF]"
                  }`}
                >
                  {item.duration}
                </div>
              </div>
              </Link>
            </section>
          );
        })}
      </section>
      <Link href={'/courses'} className="text-[14px] md:text-[16px]">
      <AuthButton
        text="View Course Recommendations"
        action={isRouting}
        textWhileActionIsTakingPlace="..."
        isAuth={false}
      />
      </Link>
    </main>
  );
};

export default Suggested;
