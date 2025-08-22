import SkillLevel from "@/components/sections/onboarding/second-page/SkillLevel";
import SkillTree from "@/components/sections/skilltree/SkillTree";
import XPBar from "@/components/sections/skilltree/XPBar";
import React from "react";
interface Subtitle {
  title: string;
  link: string;
  sequence: number; // order in which it should be taken
  completedStatus: boolean;
}

// Interface for each course
interface Course {
  title: string;
  subtitles: Subtitle[];
}
const data: Course[] = [
  {
    title: "Web Development Full Course",
    subtitles: [
      {
        title: "HTML Basics",
        link: "",
        sequence: 1,
        completedStatus: true,
      },
      {
        title: "CSS Fundamentals",
        link: "",
        sequence: 2,
        completedStatus: true,
      },
      {
        title: "JavaScript Essentials",
        link: "",
        sequence: 3,
        completedStatus: false,
      },
      {
        title: "Responsive Web Design",
        link: "",
        sequence: 4,
        completedStatus: false,
      },
      {
        title: "Version Control (Git & GitHub)",
        link: "",
        sequence: 5,
        completedStatus: false,
      },
    ],
  },
  {
    title: "Frontend Frameworks",
    subtitles: [
      {
        title: "React Basics",
        link: "",
        sequence: 1,
        completedStatus: false,
      },
      {
        title: "React Hooks & State Management",
        link: "",
        sequence: 2,
        completedStatus: false,
      },
      {
        title: "Next.js Introduction",
        link: "",
        sequence: 3,
        completedStatus: false,
      },
      {
        title: "Advanced Component Patterns",
        link: "",
        sequence: 4,
        completedStatus: false,
      },
    ],
  },
  {
    title: "Backend Development",
    subtitles: [
      {
        title: "Node.js Fundamentals",
        link: "",
        sequence: 1,
        completedStatus: false,
      },
      {
        title: "Express.js Basics",
        link: "",
        sequence: 2,
        completedStatus: false,
      },
      {
        title: "REST API Development",
        link: "",
        sequence: 3,
        completedStatus: false,
      },
      {
        title: "Authentication & Security",
        link: "",
        sequence: 4,
        completedStatus: false,
      },
      {
        title: "Database Integration (MongoDB)",
        link: "",
        sequence: 5,
        completedStatus: false,
      },
    ],
  },
  {
    title: "Computer Science Fundamentals",
    subtitles: [
      {
        title: "Introduction to Algorithms",
        link: "",
        sequence: 1,
        completedStatus: true,
      },
      {
        title: "Data Structures Basics",
        link: "",
        sequence: 2,
        completedStatus: true,
      },
      {
        title: "Recursion & Complexity",
        link: "",
        sequence: 3,
        completedStatus: false,
      },
      {
        title: "Graphs & Trees",
        link: "",
        sequence: 4,
        completedStatus: false,
      },
    ],
  },
  {
    title: "DevOps & Deployment",
    subtitles: [
      {
        title: "Linux & Command Line Basics",
        link: "",
        sequence: 1,
        completedStatus: false,
      },
      {
        title: "Docker Fundamentals",
        link: "",
        sequence: 2,
        completedStatus: false,
      },
      {
        title: "CI/CD Pipelines",
        link: "",
        sequence: 3,
        completedStatus: false,
      },
      {
        title: "Cloud Deployment (AWS Basics)",
        link: "",
        sequence: 4,
        completedStatus: false,
      },
    ],
  },
];
const num: number = 1250;

const fmt = (num: number) => num.toLocaleString();

const HomePage = () => {
  return (
    <div className="p-4">
      <XPBar xp={fmt(num)} />
      <section>
        {data.map((course, idx) => {
          return (
            <SkillTree
              key={idx}
              title={course.title}
              subtitles={course.subtitles}
            />
          );
        })}
      </section>
    </div>
  );
};

export default HomePage;
