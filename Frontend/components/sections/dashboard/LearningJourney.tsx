
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Purple from "@/public/dashboard/purpleVector.png";
import Green from "@/public/dashboard/business.png";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { data as demoCourses } from "@/lib/testData";
import AuthButton from "@/components/common/button/Button";
import { useUserStore } from "@/state/store";
import { useUserProfileStore } from "@/state/user";

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
  const [isRouting, setIsRouting] = useState(false);
  const { daysActive } = useUserStore();
  const profile = useUserProfileStore((s) => s.profile);

  // Robust helpers (align with CourseCard behavior)
  const pickArray = (v: unknown): unknown[] => {
    if (Array.isArray(v)) return v;
    if (typeof v === 'object' && v !== null) {
      const obj = v as Record<string, unknown>;
      if (Array.isArray(obj.results)) return obj.results;
      if (Array.isArray(obj.courses)) return obj.courses;
    }
    return [];
  };
  const getUserFromEnrollment = (e: unknown): string | number | null => {
    if (typeof e === 'object' && e !== null) {
      const obj = e as Record<string, unknown>;
      const u = obj.user;
      if (typeof u === 'string' || typeof u === 'number') return u;
    }
    return null;
  };
  const getCourseFromEnrollment = (e: unknown): unknown => {
    if (typeof e === 'object' && e !== null) {
      const obj = e as Record<string, unknown>;
      return obj.course;
    }
    return null;
  };

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await fetch("https://nuroki-backend.onrender.com/enrollments/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Failed to fetch enrollments: ${res.status}`);
        const raw: unknown = await res.json();
        const all = pickArray(raw);
        // Filter to current user if user_id is known
        const userId = profile?.user_id;
        const mine = userId == null
          ? all
          : all.filter((enr) => {
              const uidVal = getUserFromEnrollment(enr);
              return uidVal !== null && String(uidVal) === String(userId);
            });

        // Resolve unique course ids and fetch meta for each
        const ids = Array.from(new Set(
          mine
            .map((enr) => getCourseFromEnrollment(enr))
            .map((c) => {
              // reuse resolver below
              return ((): number | null => {
                if (c == null) return null;
                if (typeof c === 'number') return c;
                if (typeof c === 'string') {
                  const n = Number(c);
                  return Number.isFinite(n) ? n : null;
                }
                const obj = c as Record<string, unknown>;
                const cand = (obj.course_id ?? obj.id ?? obj.courseId) as unknown;
                const n = Number(cand);
                return Number.isFinite(n) ? n : null;
              })();
            })
            .filter((n): n is number => n != null)
        ));

        const metaEntries: [string, CourseMeta][] = [];
        await Promise.all(
          ids.map(async (id) => {
            try {
              const mRes = await fetch(`https://nuroki-backend.onrender.com/courses/${id}/`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
              });
              if (!mRes.ok) throw new Error(`meta ${id} ${mRes.status}`);
              const mRaw: any = await mRes.json();
              const title = mRaw?.title || mRaw?.name || mRaw?.course_title;
              const url = mRaw?.external_url || mRaw?.url || mRaw?.link;
              const external = Boolean(url) || mRaw?.source === 'external' || mRaw?.is_external === true;
              metaEntries.push([String(id), { title, url, external }]);
            } catch {
              // ignore individual meta failures
            }
          })
        );

        setCourseMeta((prev) => ({ ...prev, ...Object.fromEntries(metaEntries) }));
        setEnrollments(mine as Enrollment[]);
      } catch (err) {
        console.error(err);
        setEnrollments([]);
      }
    };
    fetchEnrollments();
  }, [profile?.user_id]);


  const resolveCourseId = (
    course: number | string | { id?: string; course_id?: string; courseId?: string }
  ): number | null => {
    if (course == null) return null;
    if (typeof course === "number") return course;
    if (typeof course === "string") {
      const n = Number(course);
      return Number.isFinite(n) ? n : null;
    }
    // object case
    const cand = course.id ?? course.course_id ?? course.courseId;
    const n = Number(cand);
    return Number.isFinite(n) ? n : null;
  };


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
              <ChevronRight size={20} className="size-3 md:size-6 text-[#4A4A4A]" />
            </div>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {shownData.length === 0 && (
          daysActive > 5 ? (
          <div className="space-y-4">
            {demoCourses.slice(0, 2).map((item, index) => {
              const isGreen = index % 2 !== 0;
              const total = item.subtitles.length;
              const completed = item.subtitles.filter((s) => s.status === "completed").length;
              const progress = total > 0 ? Math.min((completed / total) * 100, 100) : 0;
              return (
                <div
                  key={`demo-${index}`}
                  className={`flex gap-2 items-center text-[16px] font-semibold space-x-2 rounded-2xl p-[16px] ${isGreen ? "bg-[#EBFFFC]" : "bg-[#F1EFFF]"
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
          ) : (
            <div className="text-center space-y-6">
              <div>
              <p className="text-[20px] font-semibold">No courses yet!</p>
              <p className="text-[#4A4A4A]">Start your first course and track your progress here</p>
              </div>
              <Link href={'/courses'} className="text-[14px] md:text-[16px]">
                <AuthButton
                  text="Browse Courses"
                  action={isRouting}
                  textWhileActionIsTakingPlace="..."
                  isAuth={false}
                />
              </Link>
            </div>
          )
        )}

        {shownData.map((item, index) => {
          const isGreen = index % 2 !== 0;
          // type CourseValue = number | string | Record<string, unknown>;
          type CourseValue = number | string | { id?: string; course_id?: string; courseId?: string };

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
              className={`flex gap-2 items-center text-[16px] font-semibold space-x-2 rounded-2xl p-[16px] ${isGreen ? "bg-[#EBFFFC]" : "bg-[#F1EFFF]"
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
                  <p className="font-semibold text-[18px] max-w-[185px] md:max-w-[185px]  truncate">
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





