"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Side from "@/public/dashboard/sideArrow.png";
import { useUserStore } from "@/state/store";
import { useUserProfileStore } from "@/state/user";

type JournalEntry = {
  created_at: string;        
  sentiment_score: number;   
};

type Enrollment = { enrollment: number; user: string | number; course: string | number };

const Progress = () => {
  const {daysActive, setDaysActive, avgMood, setAvgMood} = useUserStore()
  const profile = useUserProfileStore((s) => s.profile)
  const [enrolledCount, setEnrolledCount] = useState(0)

  const fetchProgress = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://34.228.198.154/journal/",{
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: JournalEntry[] = await res.json();

      // count unique YYYY-MM-DD values
      const uniqueDays = new Set<string>();
      let scoreSum = 0;

      data.forEach((entry) => {
        const isoDay = new Date(entry.created_at).toISOString().slice(0, 10);
        uniqueDays.add(isoDay);
        scoreSum += entry.sentiment_score * 5; // scale 0–1 → 0–5
      });

      setDaysActive(uniqueDays.size);
      setAvgMood(data.length ? scoreSum / data.length : 0);

    } catch (err) {
      console.error("progress fetch error", err);
    }
  }, [setDaysActive, setAvgMood]);

  const fetchEnrollmentsCount = useCallback(async () => {
    try {
      const res = await fetch('https://nuroki-backend.onrender.com/enrollments/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      })
      if (!res.ok) return
      const raw: unknown = await res.json()
      const arr: Enrollment[] = Array.isArray(raw) ? raw : Array.isArray((raw as any)?.results) ? (raw as any).results : Array.isArray((raw as any)?.courses) ? (raw as any).courses : []
      const uid = profile?.user_id
      const count = uid == null ? arr.length : arr.filter(e => String(e.user) === String(uid)).length
      setEnrolledCount(count)
    } catch (e) {
      // best effort only
    }
  }, [profile?.user_id])

  useEffect(() => {
    fetchProgress();
    fetchEnrollmentsCount();
  }, [fetchProgress, fetchEnrollmentsCount]);

  // Refresh progress immediately after a mood/journal is logged
  useEffect(() => {
    const handler = () => fetchProgress();
    window.addEventListener("journal:updated", handler);
    return () => window.removeEventListener("journal:updated", handler);
  }, [fetchProgress]);

  return (
    <main className="h-full flex flex-col justify-between w-full p-4 md:px-8 py-6 rounded-[16px] select-none">
      {/* Header */}
      <div className="flex justify-between items-center pb-5">
        <p className="text-[18px] font-bold md:text-[24px]">Your Progress</p>
          <Link href="/insights" >
        <div className="flex gap-3 items-center">
          <p className="text-[#4A4A4A] text-[14px] md:text-[18px] hover:cursor-pointer">
            View detailed analytics
          </p>
          <Image src={Side} alt="View Analytics" />
        </div>
        </Link>
      </div>

      {/* Metrics */}
      <section className="space-y-4">
        <div className="flex justify-between items-center text-[16px] font-semibold space-x-2 rounded-2xl p-[16px]">
          {/* Days Active */}
          <div className="text-center space-y-2">
            <p className="text-[#886CFF] text-[24px] md:text-[40px] font-bold">
              {daysActive}
            </p>
            <p className="text-[13px] md:text-[18px] font-bold">Day{ daysActive == 1 ? (<span></span>) : (<span>s</span>)} Active</p>
          </div>

          {/* Courses Enrolled */}
          <div className="text-center space-y-2">
            <p className="text-[#FF6665] text-[24px] md:text-[40px] font-bold">
              {enrolledCount}
            </p>
            <p className="text-[13px] md:text-[18px] font-bold">
              {enrolledCount === 1 ? 'Course ' : 'Courses '} Enrolled
            </p>
          </div>

          {/* Avg Mood Score */}
          <div className="text-center space-y-2">
            <p className="text-[#7ABF00] text-[24px] md:text-[40px] font-bold">
              {avgMood.toFixed(1)}/5
            </p>
            <p className="text-[13px] md:text-[18px] font-bold">
              Avg Mood Score
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Progress;


