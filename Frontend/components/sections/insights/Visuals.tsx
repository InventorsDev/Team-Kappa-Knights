"use client";
import React, { useState, useEffect } from "react";
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
import mood from "@/components/common/graphs/testMood.json";
import { useRouter } from "next/navigation";
import { JournalEntry } from "@/types/journal";
import Loader from "@/components/common/loader/Loader";

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

const moodLabelsMap: Record<string, number> = {
  frustrated: 0,
  stressed: 1,
  tired: 2,
  okay: 3,
  excited: 4,
  motivated: 5,
};

const getSentimentScore = async (token: string) => {
  try {
    const res = await fetch("http://34.228.198.154/journal/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const journalData = await res.json();
    return journalData;
  } catch (err) {
    console.log(err);
  }
};

const Visuals = () => {
  const progress = getCourseProgress(data);
  const router = useRouter();
  const { completed, inProgress, notStarted } = getOverallStatus(data);
  const [journalData, setJournalData] = useState<JournalEntry[]>([]);
  const [journalLoading, setJournalLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }
    const fetchData = async () => {
      const data = await getSentimentScore(token);
      console.log(data);
      setJournalData(data);
      setJournalLoading(false);
    };
    fetchData();
  }, []);
  // ✅ Transform journal entries → chart data
  const moodChartLabels = journalData.map((entry) => entry.created_at);
  const moodChartValues = journalData.map(
    (entry) => moodLabelsMap[entry.mood] ?? null
  );

  return (
    <section className="select-none ">
      <p className="pb-3 font-bold text-[20px] md:text-[24px]">
        Learning Visuals
      </p>
      <div className=" space-y-3 gap-x-10 gap-y-8">
        {/* <div className="relative border ">
          <VisualCards
            props={{
              title: "overall course status",
              subtitle: "overall course completion status   ",
            }}
          >
            <div className="grid place-items-center">
              <PieChart
                labels={["Completed", "In-Progress", "Not Started"]}
                dataValues={[completed, inProgress, notStarted]}
                title="Learning Progress Breakdown"
              />
            </div>
          </VisualCards>
        </div> */}
        <div>
          <VisualCards
            props={{
              title: "Per Course Progress",
              subtitle: "Your learning progress per course",
            }}
          >
            <div className="grid place-items-center">
              <BarChart
                labels={progress.map((c) => c.title)}
                dataValues={progress.map((c) => c.completionRate)}
                title="Course Completion Rates"
              />
            </div>
          </VisualCards>
        </div>
        <div className="col-span-2">
          {journalLoading ? (
            <Loader />
          ) : (
            <VisualCards
              props={{
                title: "Motivational Level Trend",
                subtitle: "Your emotional well-being over time",
              }}
            >
              <LineChart
                labels={moodChartLabels}
                datasets={[
                  {
                    label: "Mood Trend",
                    data: moodChartValues,
                    borderColor: "rgb(75, 192, 192)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                  },
                ]}
                title="Mood Over Time"
              />
            </VisualCards>
          )}
        </div>
      </div>
    </section>
  );
};

export default Visuals;
