import { useEffect, useRef, useState } from "react";
import { Check, Monitor, Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "../../context/useTheme";

const options = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "auto", label: "Auto", Icon: Monitor },
];

const ThemeSwitcher = ({ className = "" }) => {
  const { preference, setThemePreference } = useTheme();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    optionRefs.current[options.findIndex((option) => option.value === preference)]?.focus();
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, preference]);

  const moveFocus = (event, currentIndex) => {
    let nextIndex = currentIndex;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") nextIndex = (currentIndex + 1) % options.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") nextIndex = (currentIndex + options.length - 1) % options.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = options.length - 1;
    else return;
    event.preventDefault();
    optionRefs.current[nextIndex]?.focus();
  };

  const ActiveIcon = preference === "light" ? Sun : preference === "dark" ? Moon : SunMoon;

  return (
    <div className={`theme-switcher ${className}`} ref={wrapperRef}>
      <button
        ref={triggerRef}
        type="button"
        className="theme-switcher-trigger"
        aria-label={`Theme preference: ${preference}. Change theme`}
        aria-haspopup="menu"
        aria-expanded={open}
        title={`Theme: ${preference}`}
        onClick={() => setOpen((value) => !value)}
      >
        <ActiveIcon aria-hidden="true" size={18} strokeWidth={1.8} />
      </button>
      <div className={`theme-switcher-menu ${open ? "is-open" : ""}`} role="menu" aria-label="Theme preference">
        {options.map(({ value, label, Icon }, index) => (
          <button
            key={value}
            ref={(element) => { optionRefs.current[index] = element; }}
            type="button"
            role="menuitemradio"
            aria-checked={preference === value}
            tabIndex={open ? 0 : -1}
            className="theme-switcher-option"
            onKeyDown={(event) => moveFocus(event, index)}
            onClick={() => { setThemePreference(value); setOpen(false); triggerRef.current?.focus(); }}
          >
            <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
            <span>{label}</span>
            {preference === value && <Check className="theme-switcher-check" size={15} aria-hidden="true" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
