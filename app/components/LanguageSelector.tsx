
import { useState } from "react";
import { Globe, ChevronDown } from "lucide-react";

export function LanguageSelector() {
  const [selectedLang, setSelectedLang] = useState("English");
  const [open, setOpen] = useState(false);
  const languages = ["English", "Hindi", "Spanish"];

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 border px-3 py-2 rounded-md hover:bg-muted transition"
        onClick={() => setOpen(!open)}
      >
        <Globe className="w-5 h-5" />
        <span className="text-sm font-medium">{selectedLang}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <ul className="absolute right-0 mt-2 w-32 bg-white border shadow-md rounded-md text-sm z-50">
          {languages.map((lang) => (
            <li
              key={lang}
              className="px-4 py-2 hover:bg-muted cursor-pointer"
              onClick={() => {
                setSelectedLang(lang);
                setOpen(false);
              }}
            >
              {lang}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
