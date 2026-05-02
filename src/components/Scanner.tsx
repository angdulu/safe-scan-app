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
        className={`bg-white p-6 rounded-3xl shadow-sm border-2 transition-all flex flex-col items-center justify-center text-center gap-4 py-12 ${
          isDragging ? "border-blue-500 bg-blue-50/50 scale-[1.02]" : "border-gray-100"
        }`}
      >
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-2 transition-colors ${
          isDragging ? "bg-blue-100 text-blue-600" : "bg-blue-50 text-blue-500"
        }`}>
          <Camera size={40} strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{t.scanner_title_camera}</h2>
        <p className="text-gray-500 text-base px-4 font-medium leading-relaxed">
          {t.scanner_desc_camera}
        </p>

        <div className="flex gap-4 mt-4 w-full px-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 bg-blue-500 text-white py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-[0.98] shadow-md shadow-blue-500/20"
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
        <div className="h-px bg-gray-200 flex-1"></div>
        <span className="text-gray-400 font-medium text-sm">{t.scanner_divider}</span>
        <div className="h-px bg-gray-200 flex-1"></div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 px-2">{t.scanner_title_text}</h2>
        <form onSubmit={handleTextSubmit} className="relative">
          <input
            type="text"
            placeholder={t.scanner_placeholder_text}
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
      </div>

      <p className="text-gray-400 text-[10px] text-center mt-4">
        {t.scanner_privacy}
      </p>
    </motion.div>
  );
}
