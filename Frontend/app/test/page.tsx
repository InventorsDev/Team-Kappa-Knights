type CourseStatus = "locked" | "in-progress" | "completed";

interface CourseNode {
  id: string;
  title: string;
  level: number;
  status: CourseStatus;
}

const courses: CourseNode[] = [
  { id: "html", title: "HTML Basics", level: 1, status: "completed" },
  { id: "css", title: "CSS Styling", level: 2, status: "completed" },
  { id: "js", title: "JavaScript Essentials", level: 3, status: "in-progress" },
  { id: "responsive", title: "Responsive Design", level: 4, status: "locked" },
];

export default function SkillTree() {
  return (
    <div className="flex flex-col items-center space-y-6">
      {courses.map((course, i) => (
        <div key={course.id} className="flex flex-col items-center">
          <div
            className={`rounded-lg px-6 py-3 shadow-md text-white ${
              course.status === "completed"
                ? "bg-green-600"
                : course.status === "in-progress"
                ? "bg-green-300"
                : "bg-gray-400"
            }`}
          >
            {course.title}
          </div>
          {i < courses.length - 1 && (
            <div className="w-px h-6 bg-gray-400"></div> // vertical line
          )}
        </div>
      ))}
    </div>
  );
}
