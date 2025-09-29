"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Purple from "@/public/dashboard/purpleVector.png";
import Green from "@/public/dashboard/business.png";
import Side from "@/public/dashboard/sideArrow.png";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import AuthButton from "@/components/common/button/Button";

// Backend response type: [{ enrollment, user, course }]
type Enrollment = {
  enrollment: number;
  user: number | string;
  course: number | string;
};

const LearningJourney = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courseTitles, setCourseTitles] = useState<Record<string, string>>({});
    const [isRouting, setIsRouting] = useState<boolean>(false);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://nuroki-backend.onrender.com/enrollments/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Failed to fetch enrollments: ${res.status}`);
        const raw = await res.json();
        const arr: any[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.results)
          ? raw.results
          : Array.isArray(raw?.courses)
          ? raw.courses
          : [];
        setEnrollments(arr as Enrollment[]);
      } catch (err) {
        console.error(err);
        setEnrollments([]);
      }
    };
    fetchEnrollments();
  }, []);

  // Helper to resolve a course ID from the enrollment.course field
  const resolveCourseId = (course: any): number | null => {
    if (course == null) return null;
    if (typeof course === "number") return course;
    if (typeof course === "string") {
      const n = Number(course);
      return Number.isFinite(n) ? n : null;
    }
    // object case: try common keys
    const cand = course.id ?? course.course_id ?? course.courseId;
    const n = Number(cand);
    return Number.isFinite(n) ? n : null;
  };

  // Fetch course title by ID, trying common endpoints
  const fetchCourseTitle = async (id: number, token?: string): Promise<string | null> => {
    const endpoints = [
      `http://34.228.198.154/courses/${id}/`,
      `http://34.228.198.154/course/${id}/`,
    ];
    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          return data?.title || data?.name || data?.course_title || null;
        }
      } catch (_) {
        // try next endpoint
      }
    }
    return null;
  };

  // When enrollments change, fetch course titles for those with resolvable IDs
  useEffect(() => {
    const go = async () => {
      const token = localStorage.getItem("token") || undefined;
      const entries = await Promise.all(
        enrollments.map(async (enr) => {
          const id = resolveCourseId((enr as any).course);
          if (!id) return null;
          const title = await fetchCourseTitle(id, token);
          return title ? [String(id), title] : null;
        })
      );
      const map: Record<string, string> = {};
      for (const pair of entries) {
        if (pair) map[pair[0]] = pair[1];
      }
      if (Object.keys(map).length) setCourseTitles((prev) => ({ ...prev, ...map }));
    };
    if (enrollments.length) go();
  }, [enrollments]);

const shownData = enrollments.slice(0, 2);
  return (
    <main className="w-full p-4 md:px-8 rounded-[16px] h-full flex flex-col justify-between select-none">
      <div className=" pb-5 flex items-center justify-between">
        <p className="text-[14px] md:text-[24px] font-bold">
          Your Learning Journey
        </p>
        <div>
          <Link href={'/skilltree'} className="flex gap-1 md:gap-3 items-center">
            <p className=" text-[#4A4A4A] text-[14px] md:text-[18px]">View more</p>
            <div>
              <ChevronRight size={20} className="size-3 md:size-6 text-[#4A4A4A]"/>
            </div>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {shownData.length === 0 && (
          <div className="text-center space-y-3"> 
            <p>No courses yet!</p>
            <p>Start your first course and track your progress here</p>
                  <Link href={'/courses'} className="text-[14px] md:text-[16px]">
                  <AuthButton
                    text="Browse Courses"
                    action={isRouting}
                    textWhileActionIsTakingPlace="..."
                    isAuth={false}
                  />
                  </Link>
          </div>
        )}

        {shownData.map((item, index) => {
          const isGreen = index % 2 !== 0;
          // Prefer resolved course title -> then embedded object title/name -> then ID fallback
          const courseAny: any = (item as any).course;
          const courseId = resolveCourseId(courseAny);
          const titleFromObject = typeof courseAny === 'object'
            ? (courseAny?.title || courseAny?.name || courseAny?.course_title)
            : undefined;
          const title = titleFromObject
            || (courseId != null ? (courseTitles[String(courseId)] || `Course #${courseId}`) : 'Unknown course');
          const progress = 0; // unknown at this endpoint

          return (
            <div
              key={`${item.enrollment}-${index}`}
              className={`flex gap-2 items-center text-[16px] font-semibold space-x-2 rounded-2xl p-[16px] ${
                isGreen ? "bg-[#EBFFFC]" : "bg-[#F1EFFF]"
              }`}
            >
              <div>
                {isGreen ? (
                  <Image src={Green} width={32} height={32} alt="" />
                ) : (
                  <Image src={Purple} width={32} height={32} alt="" />
                )}
              </div>
              <section className="w-full space-y-2">
                <div className="flex justify-between gap-2">
                  <p className="font-semibold text-[18px] max-w-[185px] md:max-w-none truncate">
                    {title}
                  </p>
                  <span className="text-xs md:text-sm text-[#4A4A4A] font-medium">Enrolled</span>
                </div>
                <div className={`my-2 h-[6px] w-full ${isGreen ? 'bg-[#AAF4E9]' : 'bg-[#D7D2FF]'} rounded-lg overflow-hidden`}>
                  <div
                    className={`h-full ${isGreen ? 'bg-[#00bfa5]' : 'bg-[#886CFF]'} rounded-lg`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </section>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default LearningJourney;
