"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Purple from "@/public/dashboard/purpleVector.png";
import Green from "@/public/dashboard/business.png";
import Side from "@/public/dashboard/sideArrow.png";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { data as demoCourses } from "@/lib/testData";

// Backend response type: [{ enrollment, user, course }]
type Enrollment = {
  enrollment: number;
  user: number | string;
  course: number | string;
};

type CourseMeta = { title?: string; url?: string; external?: boolean };

const LearningJourney = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courseMeta, setCourseMeta] = useState<Record<string, CourseMeta>>({});

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
        const arr = Array.isArray(raw)
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

  
  const resolveCourseId = (course: number | string | {id: string, course_id: string, courseId: string}): number | null => {
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

  // Fetch course meta by ID from your courses endpoint (title, url, external)
  const fetchCourseMeta = async (id: number, token?: string): Promise<CourseMeta | null> => {
    try {
      const res = await fetch(`https://nuroki-backend.onrender.com/courses/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      });
      if (!res.ok) return null;
      const data = await res.json();
      const meta: CourseMeta = {
        title: data?.title || data?.name || data?.course_title,
        url: data?.course_url || data?.url,
        external: Boolean(
          data?.external ||
          data?.is_external ||
          (data?.course_url && /^https?:\/\//i.test(data.course_url))
        ),
      };
      return meta;
    } catch (_) {
      return null;
    }
  };

  // When enrollments change, fetch course meta for those with resolvable IDs
  useEffect(() => {
    const go = async () => {
      const token = localStorage.getItem("token") || undefined;
      const entries: Array<[string, CourseMeta] | null> = await Promise.all(
        enrollments.map(async (enr) => {
          const id = resolveCourseId((enr).course);
          if (!id) return null;
          const meta = await fetchCourseMeta(id, token);
          return meta ? ([String(id), meta] as [string, CourseMeta]) : null;
        })
      );
      const map: Record<string, CourseMeta> = {};
      for (const pair of entries) {
        if (pair) {
          const [key, val] = pair;
          map[key] = val;
        }
      }
      if (Object.keys(map).length) setCourseMeta((prev) => ({ ...prev, ...map }));
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
          <div className="space-y-4">
            {demoCourses.slice(0, 2).map((item, index) => {
              const isGreen = index % 2 !== 0;
              const total = item.subtitles.length;
              const completed = item.subtitles.filter((s) => s.status === "completed").length;
              const progress = total > 0 ? Math.min((completed / total) * 100, 100) : 0;
              return (
                <div
                  key={`demo-${index}`}
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
                        {item.title}
                      </p>
                      <span className="text-xs md:text-sm text-[#4A4A4A] font-medium">Suggested</span>
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
        )}

        {shownData.map((item, index) => {
          const isGreen = index % 2 !== 0;
          type CourseValue = number | string | Record<string, unknown>;
          const courseVal: CourseValue = item.course as CourseValue;
          const courseId = resolveCourseId(courseVal);
          const meta = courseId != null ? courseMeta[String(courseId)] : undefined;
          const titleFromObject =
            typeof courseVal === 'object' && courseVal !== null
              ? ((courseVal as Record<string, unknown>).title as string | undefined) ||
                ((courseVal as Record<string, unknown>).name as string | undefined) ||
                ((courseVal as Record<string, unknown>).course_title as string | undefined)
              : undefined;
          const title = titleFromObject || meta?.title || (courseId != null ? `Course #${courseId}` : 'Unknown course');
          const progress = 0; // unknown at this endpoint
          const badge = meta?.external ? 'Outsourced' : 'In-house';
          const href = meta?.external && meta?.url ? meta.url : (courseId != null ? `/courses/${courseId}` : undefined);

          const CardInner = (
            <div
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
                  <span className="text-xs md:text-sm text-[#4A4A4A] font-medium">{badge}</span>
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

          return (
            <div key={`${item.enrollment}-${index}`}>
              {href ? (
                meta?.external ? (
                  <a href={href} target="_blank" rel="noopener noreferrer">{CardInner}</a>
                ) : (
                  <Link href={href}>{CardInner}</Link>
                )
              ) : (
                CardInner
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default LearningJourney;
