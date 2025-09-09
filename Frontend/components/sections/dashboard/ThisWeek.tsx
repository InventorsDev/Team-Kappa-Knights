"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

// weekday order Mon–Sun
const weekOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// placeholder icons
const PLACEHOLDER_QUESTION = "/dashboard/question.png";
const PLACEHOLDER_DASH = "/dashboard/dash.png";

type JournalEntry = {
  mood: string;
  created_at: string;
};

const ThisWeek = () => {
  const [weekMoods, setWeekMoods] = useState<Record<string, string | null>>({});

  // useEffect(() => {
  //   const fetchMoods = async () => {
  //     try {
  //       const token = localStorage.getItem("token"); 
  //       const res = await fetch("http://34.228.198.154/journal/", {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       if (!res.ok) throw new Error(`Failed ${res.status}`);
  //       const data: JournalEntry[] = await res.json();

  //       // Map mood entries by weekday string
  //       const mapped: Record<string, string> = {};
  //       data.forEach((entry) => {
  //         const d = new Date(entry.created_at);
  //         // convert to local weekday
  //         const wd = weekOrder[d.getDay() === 0 ? 6 : d.getDay() - 1]; 
  //         mapped[wd] = entry.mood;
  //       });
  //       setWeekMoods(mapped);
  //     } catch (err) {
  //       console.error("fetch mood error", err);
  //     }
  //   };
  //   fetchMoods();
  // }, []);

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://34.228.198.154/journal/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`Failed ${res.status}`);
        const data: JournalEntry[] = await res.json();

        // --- figure out start of current ISO week (Mon 00:00 local)
        const now = new Date();
        const jsDay = now.getDay();           // 0=Sun
        const daysSinceMonday = jsDay === 0 ? 6 : jsDay - 1;
        const mondayStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - daysSinceMonday,
          0, 0, 0, 0
        );

        // only include entries >= mondayStart
        // const mapped: Record<string, string> = {};
        // data
        //   .filter(e => new Date(e.created_at) >= mondayStart)
        //   .forEach((entry) => {
        //     const d = new Date(entry.created_at);
        //     const wd = weekOrder[d.getDay() === 0 ? 6 : d.getDay() - 1];
        //     mapped[wd] = entry.mood;
        //   });

        // setWeekMoods(mapped);


        const mapped: Record<string, { mood: string; time: number }> = {};

        data
          .filter(e => new Date(e.created_at) >= mondayStart)
          .forEach((entry) => {
            const d = new Date(entry.created_at);
            const wd = weekOrder[d.getDay() === 0 ? 6 : d.getDay() - 1];
            const ts = d.getTime();

            // if this weekday doesn’t exist yet, or this entry is newer → replace
            if (!mapped[wd] || ts > mapped[wd].time) {
              mapped[wd] = { mood: entry.mood, time: ts };
            }
          });

        // flatten to just mood
        const final: Record<string, string> = {};
        for (const [day, val] of Object.entries(mapped)) {
          final[day] = val.mood;
        }
        setWeekMoods(final);

      } catch (err) {
        console.error("fetch mood error", err);
      }
    };
    fetchMoods();
  }, []);


  // figure out what weekday "today" is
  const todayIdx = (() => {
    const jsDay = new Date().getDay(); // 0-6
    return jsDay === 0 ? 6 : jsDay - 1; // align to weekOrder
  })();

  return (
    <main className="pt-5 space-y-3">
      <p className="text-[18px] md:text-[24px] font-bold">This Week&apos;s Journey</p>
      <section
        className="
    w-full 
    flex flex-row 
    gap-3 
    overflow-x-auto 
    scrollbar-thin scrollbar-thumb-gray-400
  "
      >
        {weekOrder.map((day, idx) => {
          let logo: string;
          let alt: string;

          if (weekMoods[day]) {
            logo = `/emotions/${weekMoods[day]}.png`;
            alt = weekMoods[day]!;
          } else if (idx === todayIdx) {
            logo = PLACEHOLDER_QUESTION;
            alt = "unknown";
          } else if (idx > todayIdx) {
            logo = PLACEHOLDER_DASH;
            alt = "future";
          } else {
            logo = PLACEHOLDER_DASH;
            alt = "missing";
          }

          const isQuestion = logo === PLACEHOLDER_QUESTION;
          const isDash = logo === PLACEHOLDER_DASH;

          return (
            <div
              key={day}
              className={`flex-none flex flex-col ${isQuestion ? "gap-4" : isDash ? "gap-8" : "gap-0"
                } items-center justify-center text-center text-[16px] bg-[#F5F5F5] font-semibold rounded-2xl p-4 min-w-[90px]`}
            >
              <p className="text-[24px] font-medium">{day}</p>
              <Image src={logo} width={logo === PLACEHOLDER_QUESTION || logo === PLACEHOLDER_DASH ? 20 : 50} height={logo === PLACEHOLDER_QUESTION || logo === PLACEHOLDER_DASH ? 20 : 50} alt={alt} />
            </div>
          );
        })}
      </section>

    </main>
  );
};

export default ThisWeek;















// "use client";
// import React from "react";
// import Image from "next/image";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import { Pagination } from "swiper/modules";

// const moods = [
//   {
//     day: "Mon",
//     logo: "motivated.png",
//     altText: "motivated",
//   },
//   {
//     day: "Tue",
//     logo: "stressed.png",
//     altText: "stressed",
//   },
//   {
//     day: "Wed",
//     logo: "excited.png",
//     altText: "excited",
//   },
//   {
//     day: "Thur",
//     logo: "okay.png",
//     altText: "okay",
//   },
//   {
//     day: "Fri",
//     logo: "frustrated.png",
//     altText: "frustrated",
//   },
//   {
//     day: "Sat",
//     logo: "tired.png",
//     altText: "tired",
//   },
//   {
//     day: "Sun",
//     logo: "tired.png",
//     altText: "tired",
//   },
// ];

// const ThisWeek = () => {
//   return (
//     <main className="pt-5 space-y-3">
//       <p className="text-[18px] md:text-[24px] font-bold">
//         This Week&apos;s Journey
//       </p>
//           <section className="w-full flex flex-wrap gap-3 ">
//             { moods.map((item, idx) => (
//               <div key={idx} className="md:flex-1 flex flex-col gap-2 items-center justify-center text-center text-[16px] bg-[#F5F5F5] font-semibold rounded-2xl p-4">
//                 <p className="text-[24px] font-medium">{item.day}</p>
//                 <Image
//                   src={`/emotions/${item.logo}`}
//                   width={50}
//                   height={50}
//                   alt={item.altText}
//                 />
//               </div>
//             ))}
//           </section>




//       {/* <section className="max-w-full overflow-hidden">
//         <Swiper
//           spaceBetween={16}
//           slidesPerView={4}
//           className="mySwiper"
//           breakpoints={{
//             300: { slidesPerView: 3 },
//             414: { slidesPerView: 3 },
//             640: { slidesPerView: 4 },
//             768: { slidesPerView: 6 },
//             1024: { slidesPerView: 6 },
//             1280: { slidesPerView: 6 },
//             1600: { slidesPerView: 8 },
//           }}
//         >
//           {moods.map((item) => (
//             <SwiperSlide key={item.day}>
//               <div className="flex flex-col gap-2 items-center justify-center text-center text-[16px] bg-[#F5F5F5] font-semibold rounded-2xl p-4">
//                 <p className="text-[24px] font-medium">{item.day}</p>
//                 <Image
//                   src={`/emotions/${item.logo}`}
//                   width={50}
//                   height={50}
//                   alt={item.altText}
//                 />
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </section> */}



//       {/* <section>
//         <Swiper
//           spaceBetween={16}
//           slidesPerView={4}
//           className="mySwiper"
//           breakpoints={{
//             300: { slidesPerView: 3 },
//             414: { slidesPerView: 3 },
//             640: { slidesPerView: 4 },
//             768: { slidesPerView: 6 },
//             1024: { slidesPerView: 6 },
//             1280: { slidesPerView: 6 },
//             1600: { slidesPerView: 8 },
//           }}
//         >
//           {moods.map((item) => {
//             // const isGreen = index % 2 !== 0
//             return (
//               <SwiperSlide key={item.day}>
//                 <div
//                   className={`flex flex-col gap-2 items-center justify-center text-center text-[16px] bg-[#F5F5F5] font-semibold space-x-2 rounded-2xl p-[16px]`}
//                 >
//                   <p className="text-[24px] font-medium">{item.day}</p>
//                   <Image
//                     src={`/emotions/${item.logo}`}
//                     width={50}
//                     height={50}
//                     alt={`${item.altText}`}
//                   />
//                 </div>
//               </SwiperSlide>
//             );
//           })}
//         </Swiper>
//       </section> */}
//     </main>
//   );
// };

// export default ThisWeek;
