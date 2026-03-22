"use client";
import { createContext, useContext, useState } from "react";

const GlobalContext = createContext(null);

export function GlobalProvider({ user, children, initialSavedCount = 0 }) {
  const [savedCount, setSavedCount] = useState(initialSavedCount);

  return (
    <GlobalContext.Provider value={{ user, savedCount, setSavedCount }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useUser() {
  return useContext(GlobalContext).user;
}

export function useSavedCount() {
  const { savedCount, setSavedCount } = useContext(GlobalContext);
  return [savedCount, setSavedCount];
}