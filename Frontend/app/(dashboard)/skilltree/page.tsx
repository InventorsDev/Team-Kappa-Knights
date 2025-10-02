'use client'
import SkillTree from "@/components/sections/skilltree/SkillTree";
import XPBar from "@/components/sections/skilltree/XPBar";
import Image from "next/image";
import SkillIcon from "@/public/dashboard/skillicon.png";
import skilltree from "@/public/SVGs/skilltree.svg";
import { useEffect, useState } from "react";
import { useUserProfileStore } from "@/state/user";
import { useUserCourses } from "@/state/store";
import AuthButton from "@/components/common/button/Button";
import Link from "next/link";

const num: number = 1250;

const fmt = (num: number) => num.toLocaleString();


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
  const { courses: knownCourses } = useUserCourses();

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

              // Prefer known title from courses store when available
              const known = knownCourses.find(c => String(c.course_id) === String(id) || String(c.id) === String(id));

              // Derive title: store > meta > fallback
              let title = known?.title || `Course #${id}`;
              if (!known && metaRes.ok) {
                try {
                  type CourseMetaDTO = { title?: unknown; name?: unknown; course_title?: unknown };
                  const metaRaw: unknown = await metaRes.json();
                  const meta = metaRaw as CourseMetaDTO;
                  const cand = (meta?.title ?? meta?.name ?? meta?.course_title);
                  if (typeof cand === 'string') title = cand;
                } catch {}
              }

              // Load any visited roadmap links from localStorage to override status
              let visited: Set<string> = new Set();
              try {
                const raw = localStorage.getItem('visitedRoadmapLinks');
                if (raw) visited = new Set(JSON.parse(raw));
              } catch {}

              // Roadmap is required to render the SkillTree entry; skip if missing
              if (!roadmapRes.ok) return;
              type RoadmapItemDTO = { sequence?: unknown; title?: unknown; name?: unknown; content_url?: unknown; status?: unknown };
              const itemsRaw: unknown = await roadmapRes.json();
              const items: RoadmapItemDTO[] = Array.isArray(itemsRaw) ? (itemsRaw as RoadmapItemDTO[]) : [];
              const subtitles: Subtitle[] = items.map((it) => {
                const rawStatus = typeof it.status === 'string' ? it.status : 'not-started';
                let status: Subtitle['status'] = rawStatus === 'completed' ? 'completed' : rawStatus === 'ongoing' ? 'in-progress' : 'not-started';
                const link = typeof it.content_url === 'string' ? it.content_url : '#';
                if (link && visited.has(link) && status === 'not-started') {
                  status = 'in-progress';
                }
                const titleVal = typeof it.title === 'string' ? it.title : (typeof it.name === 'string' ? it.name : undefined);
                const seqNum = typeof it.sequence === 'number' ? it.sequence : Number(it.sequence ?? 0);
                return {
                  title: titleVal || `Level ${seqNum || ''}`,
                  link,
                  sequence: Number.isFinite(seqNum) ? seqNum : 0,
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
  }, [userId, knownCourses]);
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
              <Image src={SkillIcon} width={200} height={300} alt="" priority className="w-full md:max-w-[200px]" />
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
