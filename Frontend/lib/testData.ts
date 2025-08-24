interface Subtitle {
  title: string;
  link: string;
  sequence: number; // order in which it should be taken
  status: "completed" | "in-progress" | "not-started";
}

// Interface for each course
interface Course {
  title: string;
  subtitles: Subtitle[];
}
export const data: Course[] = [
  {
    title: "Web Development Full Course",
    subtitles: [
      {
        title: "HTML Basics",
        link: "",
        sequence: 1,
        status: "completed",
      },
      {
        title: "CSS Fundamentals",
        link: "",
        sequence: 2,
        status: "completed",
      },
      {
        title: "JavaScript Essentials",
        link: "",
        sequence: 3,
        status: "in-progress",
      },
      {
        title: "Responsive Web Design",
        link: "",
        sequence: 4,
        status: "not-started",
      },
      {
        title: "Version Control (Git & GitHub)",
        link: "",
        sequence: 5,
        status: "not-started",
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
        status: "completed",
      },
      {
        title: "React Hooks & State Management",
        link: "",
        sequence: 2,
        status: "completed",
      },
      {
        title: "Next.js Introduction",
        link: "",
        sequence: 3,
        status: "completed",
      },
      {
        title: "Advanced Component Patterns",
        link: "",
        sequence: 4,
        status: "in-progress",
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
        status: "in-progress",
      },
      {
        title: "Express.js Basics",
        link: "",
        sequence: 2,
        status: "not-started",
      },
      {
        title: "REST API Development",
        link: "",
        sequence: 3,
        status: "not-started",
      },
      {
        title: "Authentication & Security",
        link: "",
        sequence: 4,
        status: "not-started",
      },
      {
        title: "Database Integration (MongoDB)",
        link: "",
        sequence: 5,
        status: "not-started",
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
        status: "completed",
      },
      {
        title: "Data Structures Basics",
        link: "",
        sequence: 2,
        status: "completed",
      },
      {
        title: "Recursion & Complexity",
        link: "",
        sequence: 3,
        status: "in-progress",
      },
      {
        title: "Graphs & Trees",
        link: "",
        sequence: 4,
        status: "not-started",
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
        status: "in-progress",
      },
      {
        title: "Docker Fundamentals",
        link: "",
        sequence: 2,
        status: "not-started",
      },
      {
        title: "CI/CD Pipelines",
        link: "",
        sequence: 3,
        status: "not-started",
      },
      {
        title: "Cloud Deployment (AWS Basics)",
        link: "",
        sequence: 4,
        status: "not-started",
      },
    ],
  },
];
