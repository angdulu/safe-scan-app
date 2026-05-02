import React, { useState } from "react";
import { UserProfile } from "../types";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { Language, translations, PREDEFINED_CONDITIONS } from "../translations";

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
  language: Language;
}

export function ProfileSetup({ onComplete, language }: ProfileSetupProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [customCondition, setCustomCondition] = useState("");
  const t = translations[language];

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
    // We store the keys or labels in the conditions list. 
    // For translation consistency, maybe we should store labels? 
    // The user said "don't change the text for Korean just additional one for English".
    // I'll store the labels so they show up correctly in the header too.
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
      className="min-h-screen bg-white text-gray-900 px-6 py-12 flex flex-col max-w-md mx-auto"
    >
      <div className="flex-1 pt-8">
        <h1 className="text-3xl font-extrabold mb-3 tracking-tight whitespace-pre-line">
          {t.profile_title}
        </h1>
        <p className="text-gray-500 mb-10 text-lg font-medium">
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
                className={`px-5 py-3.5 rounded-full text-base font-semibold transition-all border ${
                  isSelected
                    ? "bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-500/20"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
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
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-5 pr-14 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all focus:bg-white"
          />
          <button
            type="submit"
            disabled={!customCondition.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors disabled:text-gray-300 disabled:hover:bg-transparent"
          >
            <Plus size={24} />
          </button>
        </form>
      </div>

      <button
        onClick={handleComplete}
        disabled={selected.length === 0}
        className="w-full bg-blue-500 text-white py-4.5 rounded-2xl text-lg font-bold disabled:bg-gray-100 disabled:text-gray-400 transition-all active:scale-[0.98] mt-8 mb-4 shadow-lg shadow-blue-500/25"
      >
        {t.start_btn}
      </button>
      <div className="space-y-3 pb-6 mt-4 opacity-80">
        <p className="text-[10px] text-gray-400 text-center leading-relaxed px-4">
          {t.privacy_info}
        </p>
        <div className="h-px bg-gray-100 w-12 mx-auto"></div>
        <p className="text-[10px] text-gray-400 text-center leading-relaxed px-4">
          {t.terms_info}
        </p>
        <p className="text-[10px] text-gray-400 text-center leading-relaxed px-4 italic">
          {t.medical_disclaimer}
        </p>
      </div>
    </motion.div>
  );
}
