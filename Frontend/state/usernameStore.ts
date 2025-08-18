import { create } from "zustand";
// TODO make the name persist even when a page reload


// username prop
type userName = {
  name: string;
  setName: (name: string) => void;
};



// actual state used to handle the username
export const useUsername = create<userName>((set) => {
  return {
    name: "",
    setName: (name) => set({ name: name }),
  };
});
