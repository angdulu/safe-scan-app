import React, { useState, useRef } from "react";
import { Camera, Search } from "lucide-react";
import { UserProfile, AnalysisResult } from "../types";
import { analyzeProduct } from "../services/analyzer";
import { motion } from "motion/react";
import { Language, translations } from "../translations";

interface ScannerProps {
  profile: UserProfile;
  onResult: (result: AnalysisResult) => void;
  onLoading: (isLoading: boolean, previewUrl?: string) => void;
  language: Language;
}

export function Scanner({ profile, onResult, onLoading, language }: ScannerProps) {
  const [textInput, setTextInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[language];

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert(language === 'ko' ? "이미지 파일만 업로드 가능합니다." : "Only image files can be uploaded.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    onLoading(true, previewUrl);
    try {
      const result = await analyzeProduct(profile, file, undefined, language);
      onResult(result);
    } catch (error) {
      console.error(error);
      alert(language === 'ko' ? "분석 중 오류가 발생했습니다." : "An error occurred during analysis.");
      onLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    onLoading(true);
    try {
      const result = await analyzeProduct(profile, undefined, textInput, language);
      onResult(result);
    } catch (error) {
      console.error(error);
      alert(language === 'ko' ? "분석 중 오류가 발생했습니다." : "An error occurred during analysis.");
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
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`bg-white p-8 rounded-[2rem] border transition-all flex flex-col items-center justify-center text-center gap-4 py-12 ${
          isDragging 
            ? "border-[#3182f6] bg-[#f2f8ff] scale-[1.01] shadow-sm" 
            : "border-[#e5e8eb] hover:border-[#8b95a1]/40 hover:shadow-sm"
        }`}
      >
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-2 transition-colors ${
          isDragging ? "bg-[#3182f6]/10 text-[#3182f6]" : "bg-[#f2f4f6] text-[#8b95a1]"
        }`}>
          <Camera size={40} strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold text-[#191f28]">{t.scanner_title_camera}</h2>
        <p className="text-[#8b95a1] text-base px-4 font-medium leading-relaxed">
          {t.scanner_desc_camera}
        </p>

        <div className="flex gap-4 mt-4 w-full px-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 bg-[#3182f6] text-white py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 hover:bg-[#1c73e8] transition-all active:scale-[0.98] shadow-sm shadow-[#3182f6]/10 cursor-pointer"
          >
            <Camera size={24} />
            {t.scanner_btn_camera}
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
        <div className="h-px bg-[#e5e8eb] flex-1"></div>
        <span className="text-[#8b95a1] font-medium text-sm">{t.scanner_divider}</span>
        <div className="h-px bg-[#e5e8eb] flex-1"></div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#191f28] px-2">{t.scanner_title_text}</h2>
        <form onSubmit={handleTextSubmit} className="relative">
          <input
            type="text"
            placeholder={t.scanner_placeholder_text}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="w-full bg-[#f2f4f6] border border-transparent rounded-2xl py-4.5 pl-5 pr-14 text-base font-medium focus:outline-none focus:bg-white focus:border-[#3182f6] transition-all text-[#191f28] placeholder-[#8b95a1]"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 text-[#3182f6] hover:bg-[#f2f4f6] rounded-xl transition-colors cursor-pointer"
          >
            <Search size={24} />
          </button>
        </form>
      </div>

      <p className="text-[#8b95a1] text-[10px] text-center mt-4">
        {t.scanner_privacy}
      </p>
    </motion.div>
  );
}
