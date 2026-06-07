import React, { useState } from "react";
import { UserProfile } from "../types";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { Language, translations, PREDEFINED_CONDITIONS } from "../translations";

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
  language: Language;
  initialSelected?: string[];
}

export function ProfileSetup({ onComplete, language, initialSelected = [] }: ProfileSetupProps) {
  const t = translations[language];

  // Helper to map localized labels back to predefined condition keys
  const getConditionKey = (label: string) => {
    const koEntry = Object.entries(translations.ko.conditions).find(([_, l]) => l === label);
    if (koEntry) return koEntry[0];
    const enEntry = Object.entries(translations.en.conditions).find(([_, l]) => l === label);
    if (enEntry) return enEntry[0];
    return label;
  };

  const [selected, setSelected] = useState<string[]>(() => {
    return initialSelected.map(label => getConditionKey(label));
  });
  const [customCondition, setCustomCondition] = useState("");

  // Map predefined keys to their translated labels for display
  const getLabel = (key: string) => {
    return t.conditions[key as keyof typeof t.conditions] || key;
  };

  const toggleCondition = (condition: string) => {
    if (condition === "No Conditions") {
      setSelected(["No Conditions"]);
      return;
    }

    setSelected((prev) => {
      const newSelected = prev.filter((c) => c !== "No Conditions");
      if (newSelected.includes(condition)) {
        return newSelected.filter((c) => c !== condition);
      } else {
        return [...newSelected, condition];
      }
    });
  };

  const handleAddCustom = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = customCondition.trim();
    if (trimmed) {
      if (!selected.includes(trimmed)) {
        toggleCondition(trimmed);
      }
      setCustomCondition("");
    }
  };

  const handleComplete = () => {
    if (selected.length === 0) {
      alert(t.alert_min_one);
      return;
    }
    onComplete({ 
      conditions: selected.map(s => getLabel(s)) 
    });
  };

  const allDisplayConditions = [...PREDEFINED_CONDITIONS];
  selected.forEach(c => {
    if (!allDisplayConditions.includes(c)) {
      const noCondIndex = allDisplayConditions.indexOf("No Conditions");
      allDisplayConditions.splice(noCondIndex, 0, c);
    }
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-[#f2f4f6] text-[#191f28] px-4 py-8 flex flex-col justify-center items-center"
    >
      <div className="w-full max-w-md bg-white border border-[#e5e8eb] p-8 rounded-[2rem] shadow-sm flex flex-col min-h-[80vh] justify-between">
        <div className="flex-1 pt-4">
          <h1 className="text-3xl font-extrabold mb-3 tracking-tight whitespace-pre-line text-[#191f28]">
            {t.profile_title}
          </h1>
          <p className="text-[#8b95a1] mb-10 text-lg font-medium">
            {t.profile_desc}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {allDisplayConditions.map((condition) => {
              const isSelected = selected.includes(condition);
              const label = getLabel(condition);
              return (
                <button
                  key={condition}
                  onClick={() => toggleCondition(condition)}
                  className={`px-5 py-3.5 rounded-full text-base font-semibold transition-all border active:scale-[0.98] ${
                    isSelected
                      ? "bg-[#3182f6] border-[#3182f6] text-white shadow-sm shadow-[#3182f6]/10"
                      : "bg-white border-[#e5e8eb] text-[#191f28] hover:bg-[#f2f4f6]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleAddCustom} className="relative flex items-center">
            <input
              type="text"
              placeholder={t.placeholder_custom}
              value={customCondition}
              onChange={(e) => setCustomCondition(e.target.value)}
              className="w-full bg-[#f2f4f6] border border-transparent rounded-2xl py-4 pl-5 pr-14 text-base font-medium focus:outline-none focus:border-[#3182f6] transition-all focus:bg-white text-[#191f28] placeholder-[#8b95a1]"
            />
            <button
              type="submit"
              disabled={!customCondition.trim()}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-colors ${
                !customCondition.trim()
                  ? "text-[#8b95a1] cursor-not-allowed"
                  : "text-[#3182f6] hover:bg-[#f2f4f6]"
              }`}
            >
              <Plus size={24} />
            </button>
          </form>
        </div>

        <div>
          <button
            onClick={handleComplete}
            disabled={selected.length === 0}
            className={`w-full py-4.5 rounded-2xl text-lg font-bold transition-all mt-8 mb-4 ${
              selected.length === 0
                ? "bg-[#e5e8eb] text-[#8b95a1] cursor-not-allowed"
                : "bg-[#3182f6] text-white active:scale-[0.98] shadow-md shadow-[#3182f6]/15 hover:bg-[#1c73e8]"
            }`}
          >
            {t.start_btn}
          </button>
          <div className="space-y-3 opacity-80">
            <p className="text-[10px] text-[#8b95a1] text-center leading-relaxed px-4">
              {t.privacy_info}
            </p>
            <div className="h-px bg-[#e5e8eb] w-12 mx-auto"></div>
            <p className="text-[10px] text-[#8b95a1] text-center leading-relaxed px-4">
              {t.terms_info}
            </p>
            <p className="text-[10px] text-[#8b95a1] text-center leading-relaxed px-4 italic">
              {t.medical_disclaimer}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
