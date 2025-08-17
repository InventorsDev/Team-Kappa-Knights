import { create } from "zustand";
// TODO make the name persist even when a page reload
// added a learning exercise for you to get accustomed to state mgt using zustand

// test prop
type counterStore = {
  count: number;
  increment: () => void;
  decrement: () => void;
  incrementAsync: () => Promise<void>;
};

// username prop
type userName = {
  name: string;
  setName: (name: string) => void;
};

// test state
export const useCounterStore = create<counterStore>((set) => {
  return {
    count: 0,
    increment: () => {
      set((state) => ({ count: state.count + 1 }));
    },
    incrementAsync: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set((state) => ({ count: state.count + 1 }));
    },
    decrement: () => {
      set((state) => ({ count: state.count - 1 }));
    },
  };
});

// actual state used to handle the username
export const useUsername = create<userName>((set) => {
  return {
    name: "",
    setName(name) {
      set({ name: name });
    },
  };
});
