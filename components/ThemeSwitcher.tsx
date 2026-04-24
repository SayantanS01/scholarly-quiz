"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Palette } from "lucide-react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const themes = [
    { name: "dark", color: "#09090b", border: "#27272a" },
    { name: "red", color: "#fef2f2", border: "#dc2626" },
    { name: "yellow", color: "#fefce8", border: "#ca8a04" },
    { name: "green", color: "#f0fdf4", border: "#16a34a" },
    { name: "blue", color: "#eff6ff", border: "#2563eb" },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-card p-2 rounded-full border border-border shadow-lg">
      <Palette className="w-5 h-5 ml-2 text-foreground/50" />
      <div className="flex gap-2 mx-2">
        {themes.map((t) => (
          <button
            key={t.name}
            onClick={() => setTheme(t.name)}
            className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
              theme === t.name ? "scale-110 shadow-md" : "opacity-80"
            }`}
            style={{ backgroundColor: t.color, borderColor: t.border }}
            title={`Switch to ${t.name} theme`}
            aria-label={`Switch to ${t.name} theme`}
          />
        ))}
      </div>
    </div>
  );
}
