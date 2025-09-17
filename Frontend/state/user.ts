import { create } from "zustand";
import { UserProfile } from "@/types/user";

type UserProfileStore = {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearProfile: () => void;

  // 🔥 New individual setters
  setEmail: (email: string) => void;
  setFullName: (full_name: string) => void;
  setGender: (gender: string) => void;
  setDateOfBirth: (date_of_birth: string) => void;
  setProfilePicture: (url: string) => void;
  setInterests: (interests: string[]) => void;
  setSkills: (skills: string[]) => void;
  setBio: (bio: string) => void;
  setSkillLevel: (skill_level: UserProfile["skill_level"]) => void;
  setLearningGoal: (learning_goal: UserProfile["learning_goal"]) => void;
  setSupportStyle: (support_style: UserProfile["support_style"]) => void;
  setOnboardingCompleted: (completed: boolean) => void;
};

export const useUserProfileStore = create<UserProfileStore>((set) => ({
  profile: null,

  setProfile: (profile) => set({ profile }),

  updateProfile: (updates) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null,
    })),

  clearProfile: () => set({ profile: null }),

  // 🔥 New individual setters
  setEmail: (email) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, email } : null,
    })),

  setFullName: (full_name) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, full_name } : null,
    })),

  setGender: (gender) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, gender } : null,
    })),

  setDateOfBirth: (date_of_birth) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, date_of_birth } : null,
    })),

  setProfilePicture: (url) =>
    set((state) => ({
      profile: state.profile
        ? { ...state.profile, profile_picture_url: url }
        : null,
    })),

  setInterests: (interests) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, interests } : null,
    })),

  setSkills: (skills) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, skills } : null,
    })),

  setBio: (bio) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, bio } : null,
    })),

  setSkillLevel: (skill_level) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, skill_level } : null,
    })),

  setLearningGoal: (learning_goal) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, learning_goal } : null,
    })),

  setSupportStyle: (support_style) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, support_style } : null,
    })),

  setOnboardingCompleted: (completed) =>
    set((state) => ({
      profile: state.profile
        ? { ...state.profile, onboarding_completed: completed }
        : null,
    })),
}));
