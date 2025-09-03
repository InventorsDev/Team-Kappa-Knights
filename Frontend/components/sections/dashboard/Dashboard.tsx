import React from "react";
import Mood from "./Mood";
import LearningJourney from "./LearningJourney";
import Progress from "./Progress";
import Suggested from "./Suggested";
import ThisWeek from "./ThisWeek";
import Recent from "./Recent";

const Dashboard = () => {
  return (
    // <div>
    //   <Mood />
    //   <LearningJourney />
    //   <Progress />
    //   <Suggested />
    //   {/* <ThisWeek /> */}
    //   <Recent />
    //   {/* <Mood />
    //   <section>
    //     <LearningJourney />
    //     <Progress />
    //     <Suggested />
    //   </section>
    //   <ThisWeek />
    //   <Recent /> */}
    // </div>
    <main
      className=" w-full mx-auto  md:pb-8 space-y-8 pb-0 text-[#212121]"
      style={{ fontFamily: "var(--font-nunito), sans-serif" }}
    >
      <Mood />

      {/* Grid for Journey / Progress / Suggested */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-2xl">
            <LearningJourney />
          </div>
          <div className="border border-gray-200 rounded-2xl">
            <Progress />
          </div>
        </div>

        <div className="border border-gray-200 rounded-2xl p-6">
          <Suggested />
        </div>
      </section>

      <ThisWeek />
      <Recent />
    </main>
  );
};

export default Dashboard;



// import React, { useState } from "react";
// import Mood from "./Mood";
// import LearningJourney from "./LearningJourney";
// import Progress from "./Progress";
// import Suggested from "./Suggested";
// import ThisWeek from "./ThisWeek";
// import Recent from "./Recent";

// const Dashboard = () => {

//   return (
//     <main
//       className=" space-y-8 text-[#212121] pb-20"
//       style={{ fontFamily: "var(--font-nunito), sans-serif" }}
//     >
//       <Mood />
//       <section className="md:grid grid-cols-2 grid-rows-2 gap-5 md:gap-x-8 items-stretch">
//         <div className="md:col-start-1 md:row-start-1 md:border md:border-gray-300 md:rounded-2xl ">
//           <LearningJourney />
//         </div>

//         <div className="md:col-start-1 md:row-start-2 md:border md:border-gray-300 md:rounded-2xl ">
//           <Progress />
//         </div>

//         <div className="md:col-start-2 md:row-start-1 md:row-span-2 md:border md:border-gray-300 md:rounded-2xl md:px-8 md:pt-5 md:pb-0">
//           <Suggested />
//         </div>
//       </section>

//       <ThisWeek />
//       <Recent />
//     </main>
//   );
// };

// export default Dashboard;
