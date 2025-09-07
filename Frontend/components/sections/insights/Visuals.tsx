import React from "react";
import PerformanceCard from "./ui/PerformanceCard";
import VisualCards from "./ui/VisualCards";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BarChart from "@/components/common/graphs/BarChart";
import PieChart from "@/components/common/graphs/PieChart";
import LineChart from "@/components/common/graphs/LineChart";
import {
  getCourseProgress,
  getOverallStatus,
  getCompletionOverCourses,
} from "@/lib/charts";
import { data } from "@/lib/testData";

const Details = [
  {
    title: "Motivational Level Trend",
    subtitle: "Your emotional well-being overtime",
  },
  {
    title: "Skill Completion Overview",
    subtitle: "Breakdown of complete skills across learning paths",
  },
  {
    title: "Daily Engagement",
    subtitle: "Time spent on learning activities per day",
  },
];

const Visuals = () => {
  const progress = getCourseProgress(data);
  const { completed, inProgress, notStarted } = getOverallStatus(data);
  const { labels, values } = getCompletionOverCourses(data);
  return (
    <section className="select-none ">
      <p className="pb-3 font-bold text-[20px] md:text-[24px]">
        Learning Visuals
      </p>
      <div className=" space-y-3 md:grid grid-cols-2 gap-x-10 gap-y-8">
        <div className="relative">
          <VisualCards
            props={{
              title: "overall course status",
              subtitle: "overall course completion status   ",
            }}
          >
            <PieChart
              labels={["Completed", "In-Progress", "Not Started"]}
              dataValues={[completed, inProgress, notStarted]}
              title="Learning Progress Breakdown"
            />
          </VisualCards>
        </div>
        <div>
          <VisualCards
            props={{
              title: "Per Course Progress",
              subtitle: "Your learning progress per course",
            }}
          >
            <BarChart
              labels={progress.map((c) => c.title)}
              dataValues={progress.map((c) => c.completionRate)}
              title="Course Completion Rates"
            />
          </VisualCards>
        </div>
        {/* <div className="col-span-2">
          <VisualCards
            props={{
              title: "Daily Engagement",
              subtitle: "Time spent on learning activities per day",
            }}
          >
            <LineChart
              labels={labels.map((c) => `Course ${c}`)}
              datasets={[
                {
                  label: "Completed Courses",
                  data: values,
                  borderColor: "green",
                },
              ]}
              title="Start-to-Completion Ratio"
            />
          </VisualCards>
        </div> */}
      </div>
    </section>
  );
};

export default Visuals;
