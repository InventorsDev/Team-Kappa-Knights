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

  // define this BEFORE useEffect so it's in scope
  // const formatRelative = (iso: string) => {
  //   const days = Math.floor(
  //     (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24)
  //   );
  //   return days === 0 ? "Today" : `${days} day${days > 1 ? "s" : ""} ago`;
  // };

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











// "use client";
// import React, { useEffect, useState } from "react";

// type Journal = {
//   title: string;
//   created_at: string;
//   mood?: string;
// };

// type Activity = {
//   activity: string;
//   time: string;
// };

// const Recent = () => {
//   const [activities, setActivities] = useState<Activity[]>([]);

//   useEffect(() => {
//     const fetchJournal = async () => {
//       const token = localStorage.getItem('token');
//       try {
//         const res = await fetch("http://34.228.198.154/journal", {
//       headers: {
//         "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//           // headers: { "Content-Type": "application/json" },
//         });
//         if (!res.ok) throw new Error("Failed to fetch journals");
//         const data: Journal[] = await res.json();

//         const mapped = data
//           .sort(
//             (a, b) =>
//               new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//           )
//           .slice(0, 3) // just keep the latest 5
//           .map((entry) => ({
//             activity: entry.mood || "Journal Entry",
//             time: formatRelative(entry.created_at),
//           }));

//         setActivities(mapped);
//       } catch (err) {
//         console.error("recent activity error:", err);
//       }
//     };

//     fetchJournal();
//   }, []);

//   const formatRelative = (iso: string) => {
//     const days = Math.floor(
//       (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24)
//     );
//     return days === 0 ? "Today" : `${days} day${days > 1 ? "s" : ""} ago`;
//   };

//   return (
//     <main className="border border-[#CCC] w-full p-4 mt-10 rounded-[16px]">
//       <p className="text-[18px] md:text-[24px] font-bold pb-5">Recent Activity</p>
//       <div className="space-y-4 divide-y divide-gray-300">
//         {activities.map((item, idx) => (
//           <div key={idx} className="flex gap-2 items-center p-[16px]">
//             <section className="w-full space-y-2">
//               <div className="flex justify-between">
//                 <p className="text-[18px]">{item.activity}</p>
//                 <p className="text-[18px]">{item.time}</p>
//               </div>
//             </section>
//           </div>
//         ))}
//       </div>
//     </main>
//   );
// };

// export default Recent;






// import React, { useState } from "react";
// import Image from "next/image";
// import Purple from "@/public/dashboard/purpleVector.png";

// type activityType = {
//   activity: string;
//   time: string;
// };

// const activityContent: activityType[] = [
//   {
//     activity: "Completed level 2 of web development course",
//     time: "2 days ago",
//   },
//   {
//     activity: "Logged Mood: Happy",
//     time: "1 days ago",
//   },
//   {
//     activity: "Set new learning goals: Data Analysis",
//     time: "3 days ago",
//   },
// ];

// const Recent = () => {
//   return (
//     <main className="border border-[#CCCCCCCC] w-full p-4 mt-10 rounded-[16px] select-none">
//       <p className="text-[18px] md:text-[24px] font-bold pb-5">
//         Recent Activity
//       </p>
//       <div className="space-y-4 divide-y divide-gray-300">
//         {activityContent.map((item, index) => {
//           return (
//             <div
//               key={index}
//               className={`flex gap-2 items-center space-x-2  p-[16px] `}
//             >
//               <div>
//                 <Image src={Purple} alt="" className={`md:w-8`} />
//               </div>
//               <section className="w-full space-y-2">
//                 <div className="flex justify-between ">
//                   <p className=" text-[18px] ">{item.activity}</p>
//                   <p className=" text-[18px]">{item.time}</p>
//                 </div>
//               </section>
//             </div>
//           );
//         })}
//       </div>
//     </main>
//   );
// };

// export default Recent;
