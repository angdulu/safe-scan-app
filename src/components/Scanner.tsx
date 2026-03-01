import React, { useState, useRef } from "react";
import { Camera, Search, Image as ImageIcon } from "lucide-react";
import { UserProfile, AnalysisResult } from "../types";
import { analyzeProduct } from "../services/analyzer";
import { motion } from "motion/react";

interface ScannerProps {
  profile: UserProfile;
  onResult: (result: AnalysisResult) => void;
  onLoading: (isLoading: boolean) => void;
}

export function Scanner({ profile, onResult, onLoading }: ScannerProps) {
  const [textInput, setTextInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onLoading(true);
    try {
      const result = await analyzeProduct(profile, file);
      onResult(result);
    } catch (error) {
      console.error(error);
      alert("분석 중 오류가 발생했습니다.");
    } finally {
      onLoading(false);
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    onLoading(true);
    try {
      const result = await analyzeProduct(profile, undefined, textInput);
      onResult(result);
    } catch (error) {
      console.error(error);
      alert("분석 중 오류가 발생했습니다.");
    } finally {
      onLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col gap-6"
    >
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-4 py-12">
        <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-2">
          <Camera size={40} strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">제품 촬영하기</h2>
        <p className="text-gray-500 text-lg px-4 font-medium">
          성분표나 제품 전면을 찍어주세요.
        </p>

        <div className="flex gap-4 mt-4 w-full px-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 bg-blue-500 text-white py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-[0.98] shadow-md shadow-blue-500/20"
          >
            <Camera size={24} />
            촬영/앨범
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 px-2">
        <div className="h-px bg-gray-200 flex-1"></div>
        <span className="text-gray-400 font-medium text-sm">또는</span>
        <div className="h-px bg-gray-200 flex-1"></div>
      </div>

      <form onSubmit={handleTextSubmit} className="relative">
        <input
          type="text"
          placeholder="제품명 직접 입력 (예: 신라면)"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-2xl py-4.5 pl-5 pr-14 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
        >
          <Search size={24} />
        </button>
      </form>
    </motion.div>
  );
}
