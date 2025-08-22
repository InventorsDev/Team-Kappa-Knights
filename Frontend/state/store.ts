import { create } from "zustand";

// username prop
type userName = {
  name: string;
  setName: (name: string) => void;
};


//  state used to handle the username
export const useUsername = create<userName>((set) => {
  return {
    name: "",
    setName(name) {
      set({ name: name });
    },
  };
});
