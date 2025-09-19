// src/state/onboarding.ts
import { create } from "zustand";

type OnboardingState = {
  interests: string[];
  skillLevel: string;
  learningGoal: string;
  supportStyle: string;

  // actions
  setInterests: (interests: string[]) => void;
  addInterest: (interest: string) => void;
  removeInterest: (interest: string) => void;
  setSkillLevel: (level: string) => void;
  setLearningGoal: (goal: string) => void;
  setSupportStyle: (style: string) => void;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  interests: [],
  skillLevel: "",
  learningGoal: "",
  supportStyle: "",

  // actions
  setInterests: (interests) => set({ interests }),
  addInterest: (interest) =>
    set((state) => ({
      interests: state.interests.includes(interest)
        ? state.interests
        : [...state.interests, interest],
    })),
  removeInterest: (interest) =>
    set((state) => ({
      interests: state.interests.filter((i) => i !== interest),
    })),
  setSkillLevel: (level) => set({ skillLevel: level }),
  setLearningGoal: (goal) => set({ learningGoal: goal }),
  setSupportStyle: (style) => set({ supportStyle: style }),
  reset: () =>
    set({ interests: [], skillLevel: "", learningGoal: "", supportStyle: "" }),
}));
