'use client'
import SkillTree from "@/components/sections/skilltree/SkillTree";
import XPBar from "@/components/sections/skilltree/XPBar";
import Image from "next/image";
import SkillIcon from "@/public/dashboard/skillicon.png";
import skilltree from "@/public/SVGs/skilltree.svg";
import { useEffect, useMemo, useState } from "react";
import { useUserProfileStore } from "@/state/user";
import AuthButton from "@/components/common/button/Button";
import Link from "next/link";

const num: number = 1250;

const fmt = (num: number) => num.toLocaleString();

// Match SkillTree expected shapes
interface Subtitle {
  title: string;
  link: string;
  sequence: number;
  status: "completed" | "in-progress" | "not-started";
}
interface Course {
  title: string;
  subtitles: Subtitle[];
}

const HomePage = () => {
  const profile = useUserProfileStore((s) => s.profile);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = profile?.user_id;

  // helpers to parse varied backend shapes
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
  const resolveCourseId = (c: unknown): number | null => {
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
  };

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const enrRes = await fetch('https://nuroki-backend.onrender.com/enrollments/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });
        if (!enrRes.ok) throw new Error(`Failed to fetch enrollments (${enrRes.status})`);
        const enrRaw: unknown = await enrRes.json();
        const all = pickArray(enrRaw);
        const mine = userId == null
          ? all
          : all.filter((e) => {
            const uidVal = getUserFromEnrollment(e);
            return uidVal !== null && String(uidVal) === String(userId);
          });

        // 2) collect unique course ids
        const ids = Array.from(new Set(
          mine
            .map((e) => getCourseFromEnrollment(e))
            .map((c) => resolveCourseId(c))
            .filter((n): n is number => n != null)
        ));

        // 3) fetch titles and roadmaps for each id
        const built: Course[] = [];
        await Promise.all(
          ids.map(async (id) => {
            try {
              const [metaRes, roadmapRes] = await Promise.all([
                fetch(`https://nuroki-backend.onrender.com/courses/${id}/`, {
                  method: 'GET', headers: { 'Content-Type': 'application/json' }, cache: 'no-store'
                }),
                fetch(`https://nuroki-backend.onrender.com/roadmaps/${id}/contents/`, {
                  method: 'GET', headers: { 'Content-Type': 'application/json' }, cache: 'no-store'
                }),
              ]);

              // Derive title if meta exists; otherwise fallback
              let title = `Course #${id}`;
              if (metaRes.ok) {
                try {
                  const meta: any = await metaRes.json();
                  title = meta?.title || meta?.name || meta?.course_title || title;
                } catch { }
              }

              // Roadmap is required to render the SkillTree entry; skip if missing
              if (!roadmapRes.ok) return;
              const items: any[] = await roadmapRes.json();
              const subtitles: Subtitle[] = items.map((it: any) => {
                const raw = (it?.status as string) || 'not-started';
                const status = raw === 'completed' ? 'completed' : raw === 'ongoing' ? 'in-progress' : 'not-started';
                return {
                  title: it?.title || it?.name || `Level ${it?.sequence ?? ''}`,
                  link: it?.content_url || '#',
                  sequence: Number(it?.sequence) || 0,
                  status,
                };
              }).sort((a, b) => a.sequence - b.sequence);
              built.push({ title, subtitles });
            } catch (e) {
              // skip broken course ids
            }
          })
        );
        setCourses(built);
      } catch (e) {
        console.error(e);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [userId]);

  return (
    <div className="text-[#212121]" style={{ fontFamily: 'var(--font-nunito)' }}>
      <header className="flex py-4 items-center justify-between text-[#212121]">
        <div>
          <h1 className="font-[700] text-[24px] md:text-[32px]">
            Your Learning Journey
          </h1>
          <p className="text-[16px]">
            Track your progress through various tech learning paths.
          </p>
        </div>
        <Image src={skilltree} alt="Skill Tree" height={70} width={70} />
      </header>
      <XPBar xp={fmt(num)} />
      <section className="flex flex-col gap-4 py-4">
        {loading ? (
          <div className="text-[#4A4A4A]">Loading skill tree…</div>
        ) : courses.length === 0 ? (
          <div className="text-center pt-6">
            <div className="px-6 w-full flex justify-center">
              <Image src={SkillIcon} width={200} height={300} alt="" className="w-full md:max-w-[200px]" />
            </div>
            <p className="text-[24px] font-semibold">Your Learning Journey awaits you!</p>
            <p className="text-[#4A4A4A] text-[20px]">Start your first course to grow your tree and unlock new skills.</p>
            <div className="flex justify-center px-6 w-full pt-12">
              <Link href={'/courses'} className="w-[300px] md:w-[450px] ">
            <AuthButton
              text="View Recommendations"
              // action={isRouting}
              textWhileActionIsTakingPlace="..."
              isAuth={false}
            />
            </Link>
            </div>
          </div>
        ) : (
          courses.map((course, idx) => {
            const total = course.subtitles.length;
            const completed = course.subtitles.filter((s) => s.status === 'completed').length;
            return (
              <SkillTree key={idx} data={course} completed={completed} total={total} />
            );
          })
        )}
      </section>
    </div>
  );
};

export default HomePage;
