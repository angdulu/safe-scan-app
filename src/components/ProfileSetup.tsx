import React, { useState } from "react";
import { UserProfile } from "../types";
import { motion } from "motion/react";
import { Plus } from "lucide-react";

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
}

const CONDITIONS = [
  "당뇨",
  "고혈압",
  "임산부",
  "호흡기 질환",
  "견과류 알레르기",
  "유제품 알레르기",
  "갑상선 질환",
  "위장 장애",
  "특별한 질환 없음",
];

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [customCondition, setCustomCondition] = useState("");

  const toggleCondition = (condition: string) => {
    if (condition === "특별한 질환 없음") {
      setSelected(["특별한 질환 없음"]);
      return;
    }

    setSelected((prev) => {
      const newSelected = prev.filter((c) => c !== "특별한 질환 없음");
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
      alert("최소 하나의 상태를 선택해주세요.");
      return;
    }
    onComplete({ conditions: selected });
  };

  // Combine predefined conditions and any custom ones that are currently selected
  const allDisplayConditions = [...CONDITIONS];
  selected.forEach(c => {
    if (!allDisplayConditions.includes(c)) {
      allDisplayConditions.splice(allDisplayConditions.length - 1, 0, c); // Insert before "특별한 질환 없음"
    }
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-white text-gray-900 px-6 py-12 flex flex-col max-w-md mx-auto"
    >
      <div className="flex-1">
        <h1 className="text-3xl font-extrabold mb-3 tracking-tight">건강 상태를<br />알려주세요</h1>
        <p className="text-gray-500 mb-10 text-lg font-medium">
          맞춤형 성분 분석을 위해 필요해요.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {allDisplayConditions.map((condition) => {
            const isSelected = selected.includes(condition);
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
                {condition}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleAddCustom} className="relative flex items-center">
          <input
            type="text"
            placeholder="기타 질환 직접 입력"
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
        className="w-full bg-blue-500 text-white py-4.5 rounded-2xl text-lg font-bold disabled:bg-gray-100 disabled:text-gray-400 transition-all active:scale-[0.98] mt-8"
      >
        시작하기
      </button>
    </motion.div>
  );
}
