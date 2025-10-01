
'use client'
import React, { useCallback, useEffect } from 'react'
import PerformanceCard from './ui/PerformanceCard'
import { useUserStore } from '@/state/store';
import { JournalEntry } from '@/types/journal';


const Performance = () => {
     const {daysActive, setDaysActive, avgMood, setAvgMood} = useUserStore()
    
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
          console.log("Raw sentiment scores:", data.map(d => d.sentiment_score))
    
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
    
      useEffect(() => {
        fetchProgress();
      }, [fetchProgress]);
    
      // Refresh progress immediately after a mood/journal is logged
      useEffect(() => {
        const handler = () => fetchProgress();
        window.addEventListener("journal:updated", handler);
        return () => window.removeEventListener("journal:updated", handler);
      }, [fetchProgress]);


      
const Details = [
    {
        title: 'Skills Completed',
        icon: '/dashboard/insights/skillsCompleted.png',
        num: 0,
        numText: '',
        text: 'Total Unique Skills mastered'
    },
    {
        title: 'Active Days',
        icon: '/dashboard/insights/daysActive.png',
        num: daysActive,
        numText: ( daysActive === 1 ? 'Day' : 'Days'),
        text: 'Your current longest learning streak'
    },
    {
        title: 'Hours Studied',
        icon: '/dashboard/insights/hoursStudied.png',
        num: 0,
        numText: 'Hours',
        text: 'Total time spent learning on Nuroki'
    },
    {
        title: 'Average Motivation',
        icon: '/dashboard/insights/motivation.png',
        num: Number(avgMood.toFixed(1))/5 * 100,
        numText: '%',
        text: 'Your average self-reported motivation level'
    },
]
    return (
        <section className='select-none'>
            <p className='pb-3 font-bold text-[20px] md:text-[24px]'>Overall Performance</p>
            <div className='grid grid-cols-2 gap-3 lg:flex md:w-full items-stretch'>
                {Details.map((item, idx) => (
                    <div key={idx} className='h-full'>
                    <PerformanceCard props={{
                        title: item.title,
                        icon: item.icon,
                        num: item.num,
                        numText: item.numText,
                        details: item.text
                    }} />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Performance