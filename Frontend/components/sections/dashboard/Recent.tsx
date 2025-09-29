"use client";
import React, { useEffect, useState, useCallback } from "react";

type Journal = {
  content: string;
  mood?: string;
  created_at: string;
};

type Activity = {
  activity: string;
  time: string;
};

const Recent = () => {
  const [activities, setActivities] = useState<Activity[]>([]);


  const formatTime = (iso: string) => {
    try {
      const date = new Date(iso);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      
      // Format time as HH:MM (24-hour format)
      const timeString = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      // Format date as abbreviated month and day
      const dateString = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      
      return `${timeString} - ${dateString}`;
    } catch (error) {
      console.error('Date formatting error:', error);
      return "Invalid date";
    }
  };


  const fetchJournal = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://34.228.198.154/journal", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error(`Failed to fetch journals: ${res.status}`);
      const data: Journal[] = await res.json();

      const mapped = data
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 3)
        .map((entry) => ({
          // prefer mood if present, else use some snippet of content
          activity: entry.mood
            ? `Logged Mood: ${entry.mood}`
            : entry.content
            ? `Journal: ${entry.content.slice(0, 30)}...`
            : "Journal Entry",
            time: formatTime(entry.created_at),
        }));

      setActivities(mapped);
    } catch (err) {
      console.error("recent activity error:", err);
    }
  }, []);

  useEffect(() => {
    fetchJournal();

    // Poll for updates every 10 seconds to auto-refresh recent activity
    const interval = setInterval(fetchJournal, 10000);
    return () => clearInterval(interval);
  }, [fetchJournal]);

  // Expose a custom event to trigger refresh immediately after mood logging
  useEffect(() => {
    const handler = () => fetchJournal();
    window.addEventListener("journal:updated", handler);
    return () => window.removeEventListener("journal:updated", handler);
  }, [fetchJournal]);

  return (
    <main className="border border-[#CCC] w-full p-4 mt-10 rounded-[16px]">
      <p className="text-[18px] md:text-[24px] font-bold pb-5">Recent Activity</p>
      <div className="space-y-4 divide-y divide-gray-300">
        {activities.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center md:p-[16px] space-y-4 text-[14px] md:text-[18px]">
            <p className="">{item.activity}</p>
            <p className="">{item.time}</p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Recent;


