export type UserProfile = {
  user_id: string;
  email: string;
  full_name: string;
  gender: string;
  date_of_birth: string; // ISO date (YYYY-MM-DD)
  profile_picture_url: string;
  interests: string[];
  skills: string[];
  bio: string;
  skill_level: "beginner" | "intermediate" | "advanced";
  learning_goal: "career_switch" | "personal_growth" | "upskill" | string;
  support_style: "gentle_reminders" | "intensive_support" | string;
  onboarding_completed: boolean;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
};
