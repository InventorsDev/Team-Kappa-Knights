import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Activity = {
  activity: string
  time: string
}

export type DateParts = {
  year: string
  month: string
  day: string
}

export type CourseDataType = {
  course_url: string
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
  name: string
  email: string
  gender: string
  dob: DateParts
  password: string
  mood: string
  desc: string
  profilePic: string
  selectedSkillLevel: string
  goal: string

  daysActive: number
  avgMood: number

  activities: Activity[]
  selectedTags: string[]
  interests: string[]

  setName: (name: string) => void
  setEmail: (email: string) => void
  setGender: (gender: string) => void
  setDob: (dob: DateParts) => void
  setProfilePic: (profilePic: string) => void
  setPassword: (password: string) => void
  setMood: (mood: string) => void
  setDesc: (desc: string) => void
  setSelectedSkillLevel: (selectedSkillLevels: string) => void
  setGoal: (goals: string) => void
  setDaysActive: (days: number) => void
  setAvgMood: (score: number) => void

  setActivities: (act: Activity[]) => void
  setSelectedTags: (selected: string[] | ((prev: string[]) => string[])) => void
  addActivity: (act: Activity) => void
  setInterests: (interest: string[]) => void
}


export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: "",
      email: "",
      gender: "",
      dob: { day: "", month: "", year: "" },
      password: "",
      profilePic: "",
      mood: "",
      desc: "",
      selectedSkillLevel: "",
      goal: "",

      activities: [],
      daysActive: 0,
      avgMood: 0,

      selectedTags: [],
      interests: [],

      setName: (name) => set({ name }),
      setEmail: (email) => set({ email }),
      setGender: (gender) => set({ gender }),
      setDob: (dob) => set({ dob }),
      setProfilePic: (profilePic) => set({ profilePic }),
      setPassword: (password) => set({ password }),
      setMood: (mood) => set({ mood }),
      setDesc: (desc) => set({ desc }),
      setDaysActive: (days) => set({ daysActive: days }),
      setAvgMood: (score) => set({ avgMood: score }),

      setActivities: (acts) => set({ activities: acts }),
      setSelectedTags: (selected) =>
        set((state) => ({
          selectedTags:
            typeof selected === "function"
              ? selected(state.selectedTags)
              : selected,
        })),
      addActivity: (act) =>
        set((state) => ({ activities: [...state.activities, act] })),
      setSelectedSkillLevel: (selectedSkillLevels) =>
        set({ selectedSkillLevel: selectedSkillLevels }),
      setGoal: (goals) => set({ goal: goals }),
      setInterests: (interest) => set({ interests: interest }),
    }),
    {
      name: "user-store", // key in localStorage
    }
  )
)

type UserCourses = {
  courses: CourseDataType[]
  courseItems: RoadmapContentType[]

  setCourses: (newCourses: CourseDataType[]) => void
  setCourseItems: (newCourses: RoadmapContentType[]) => void
}
export const useUserCourses = create<UserCourses>()(
  persist(
    (set) => ({

      courses: [],
      courseItems: [],
      setCourses: (newCourses) => set({ courses: newCourses }),
      setCourseItems: (newItems) => set({ courseItems: newItems }),
    }),
    {
      name: 'user-store'
    }))