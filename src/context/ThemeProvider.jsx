import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ThemeContext } from "./themeContext";

const STORAGE_KEY = "linkprosoft-theme-preference";

const getInitialPreference = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return ["light", "dark", "auto"].includes(stored) ? stored : "auto";
  } catch {
    return "auto";
  }
};

export const ThemeProvider = ({ children }) => {
  const [preference, setPreference] = useState(getInitialPreference);
  const [systemDark, setSystemDark] = useState(() =>
    window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false
  );

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!media) return undefined;
    const update = (event) => setSystemDark(event.matches);
    setSystemDark(media.matches);
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  const setThemePreference = useCallback((next) => {
    if (!["light", "dark", "auto"].includes(next)) return;
    setPreference(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* Storage may be unavailable. */ }
  }, []);

  const resolvedTheme = preference === "auto" ? (systemDark ? "dark" : "light") : preference;
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const value = useMemo(() => ({ preference, resolvedTheme, setThemePreference }), [preference, resolvedTheme, setThemePreference]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
