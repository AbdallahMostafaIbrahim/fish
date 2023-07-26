import { create } from "zustand";

interface UserStore {
  user?: {
    id: string;
    name: string;
    email: string;
  };
  setUser: (user?: UserStore["user"]) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  setUser(user) {
    set({ user });
  },
}));
