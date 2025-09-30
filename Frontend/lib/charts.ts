type Course = {
  title: string;
  subtitles: {
    title: string;
    link: string;
    sequence: number;
    status: "completed" | "in-progress" | "not-started";
  }[];
};

export const getCourseProgress = (courses: Course[]) => {
  return courses.map((course) => {
    const total = course.subtitles.length;
    const completed = course.subtitles.filter(
      (s) => s.status === "completed"
    ).length;

    return {
      title: course.title,
      completionRate: Math.round((completed / total) * 100), // percentage
    };
  });
};

export const getOverallStatus = (courses: Course[]) => {
  let completed = 0;
  let inProgress = 0;
  let notStarted = 0;

  courses.forEach((course) => {
    course.subtitles.forEach((sub) => {
      if (sub.status === "completed") completed++;
      if (sub.status === "in-progress") inProgress++;
      if (sub.status === "not-started") notStarted++;
    });
  });

  return { completed, inProgress, notStarted };
};

export const getCompletionOverCourses = (courses: Course[]) => {
  let completedCount = 0;
  const labels: number[] = [];
  const values: number[] = [];

  courses.forEach((course, index) => {
    const total = course.subtitles.length;
    const completed = course.subtitles.filter(
      (s) => s.status === "completed"
    ).length;

    if (completed === total && total > 0) {
      completedCount++;
    }

    labels.push(index + 1); // course number
    values.push(completedCount);
  });

  return { labels, values };
};
