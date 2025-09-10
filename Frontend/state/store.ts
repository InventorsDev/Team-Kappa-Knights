
import Interest from "@/components/sections/onboarding/first_page/Interest";
import { profile } from "console";
import { create } from "zustand";

export type Activity = {
  activity: string;
  time: string;
};

export type DateParts = {
  year: string;
  month: string; // e.g. "March"
  day: string ;
};


// export type CourseData = {
//   course_id: number,
// "title": "Introduction to Python",
// "description": "Learn the basics of Python programming.",
// "created_at": "2025-08-22T10:00:00Z",
// "updated_at": "2025-08-22T10:00:00Z",
// "course_url": "https://example.com/python",
// "difficulty": "beginner",
// "rating": 4.5,
// "tags": [
// { "tag_id": 1, "name": "python" }
// ]

// }


export type CourseDataType = {
  id: number
  title: string
  description: string
  tutor: string
  duration: string
  progress: number
  difficulty: string
  rating: number
  overview: string
  index: number
  levelsCompleted: number
  levelTotal: number
  levelsArray: {
    id: number
    levelTitle: string
    levelContent: string
    levelTime: number
    levelStatusIcon: string
    levelStatus: string
  }[]
  instructor: string
  instructorRole: string
  instructorCourses: string
  instructorStudents: string
  instructorRatings: number
}

export type RoadmapContentType = {
  id: number
  levelTitle: string
  levelContent: string
  levelTime: number
  levelStatusIcon: string
  levelStatus: string
}


type UserState = {
  // strings
  name: string;
  email: string;
  gender: string;
  dob: DateParts;        // ISO or "YYYY-MM-DD"
  password: string;
  mood: string;
  desc: string;
  profilePic: string;
  selectedSkillLevel: string;
  goal: string;

  // numbers
  daysActive: number;
  avgMood: number;

  // array of activities
  activities: Activity[];
  selectedTags: string[]
  courses: CourseDataType[]
  courseItems: RoadmapContentType[]
  interests: string[];

  // setters
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setGender: (gender: string) => void;
  setDob: (dob: DateParts) => void;
  setProfilePic: (profilePic: string) => void
  setPassword: (password: string) => void;
  setMood: (mood: string) => void;
  setDesc: (desc: string) => void;
  setSelectedSkillLevel: (selectedSkillLevels: string) => void;
  setGoal: (goals: string) => void;
  setDaysActive: (days: number) => void;
  setAvgMood: (score: number) => void;

  setActivities: (acts: Activity[]) => void;
  // setSelectedTags: (selectedTags: any) => void
  // setSelectedTags: (selectedTags: string[] | ((prev: string[]) => string[])) => void
   setSelectedTags: (
    selected: string[] | ((prev: string[]) => string[])
  ) => void;

  addActivity: (act: Activity) => void;
  setCourses: (newCourses: CourseDataType[]) => void
  setCourseItems: (newCourses: RoadmapContentType[]) => void
  setInterests: (interest: string[]) => void;
};

export const useUserStore = create<UserState>((set) => ({
  // defaults
  name: "",
  email: "",
  gender: "",
  dob: { day: '', month: "", year: ""},
  password: "",
  profilePic: '',
  mood: "",
  desc: "",
  selectedSkillLevel: '',
  goal: '',

  daysActive: 0,
  avgMood: 0,

  activities: [],
  selectedTags: [],
   courses: [],
   courseItems: [],
  interests: [],

  // setters
  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  setGender: (gender) => set({ gender }),
  setDob: (dob) => set({ dob }),
  setProfilePic: (profilePic) => set({profilePic}),
  setPassword: (password) => set({ password }),
  setMood: (mood) => set({ mood }),
  setDesc: (desc) => set({ desc }),
  setDaysActive: (days) => set({ daysActive: days }),
  setAvgMood: (score) => set({ avgMood: score }),

  setActivities: (acts) => set({ activities: acts }),
  // setSelectedTags: (selected) => set({ selectedTags: selected}),
  setSelectedTags: (selected) =>
    set((state) => ({
      selectedTags:
        typeof selected === "function"
          ? selected(state.selectedTags)
          : selected,
    })),
  addActivity: (act) =>
    set((state) => ({ activities: [...state.activities, act] })),
  setCourses: (newCourses) => set({ courses: newCourses }),
  setCourseItems: (newItems) => set({ courseItems: newItems }),
  setSelectedSkillLevel: (selectedSkillLevels) => set({selectedSkillLevel: selectedSkillLevels}),
  setGoal: (goals) => set({goal: goals}),
  setInterests: (interest) => set({interests: interest})
}));










// import { create } from "zustand";

// // username prop
// type userName = {
//   name: string;
//   setName: (name: string) => void;
// };

// type userEmail = {
//   email: string;
//   setEmail: (email: string) => void;
// };

// //  state used to handle the username
// export const useUsername = create<userName>((set) => {
//   return {
//     name: "",
//     setName(name) {
//       set({ name: name });
//     },
//   };
// });

// export const useUserEmail = create<userEmail>((set) => {
//   return {
//     email: "",
//     setEmail(email) {
//       set({ email: email });
//     },
//   };
// });

