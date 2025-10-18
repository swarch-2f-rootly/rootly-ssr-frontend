"use client";

import { create } from "zustand";

type UiThemeState = {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
};

export const useUiThemeStore = create<UiThemeState>((set) => ({
  theme: "light",
  setTheme: (theme) => set({ theme }),
}));


