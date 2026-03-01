import React, { useState } from "react";
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, MessageCircle, Send, Loader2 } from "lucide-react";
import { AnalysisResult, UserProfile } from "../types";
import { motion } from "motion/react";
import { askFollowUpQuestion } from "../services/analyzer";

interface ResultCardProps {
  profile: UserProfile;
  result: AnalysisResult;
  onReset: () => void;
}

export function ResultCard({ profile, result, onReset }: ResultCardProps) {
  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);

  const isSafe = result.level === "SAFE";
  const isCaution = result.level === "CAUTION";
  const isDanger = result.level === "DANGER";

  const bgColor = isSafe
    ? "bg-green-50"
    : isCaution
    ? "bg-orange-50"
    : "bg-red-50";

  const textColor = isSafe
    ? "text-green-600"
    : isCaution
    ? "text-orange-600"
    : "text-red-600";

  const Icon = isSafe ? CheckCircle : isCaution ? AlertTriangle : XCircle;

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isAsking) return;

    setIsAsking(true);
    try {
      const response = await askFollowUpQuestion(profile, result, question);
      setAnswer(response);
      setQuestion("");
    } catch (error) {
      console.error(error);
      alert("질문에 답변하는 중 오류가 발생했습니다.");
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col gap-6"
    >
      <div className={`p-8 rounded-3xl ${bgColor} flex flex-col items-center text-center shadow-sm relative overflow-hidden`}>
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-white shadow-sm ${textColor}`}
        >
          <Icon size={48} strokeWidth={2} />
        </motion.div>
        
        <h2 className={`text-3xl font-extrabold mb-4 ${textColor}`}>
          {isSafe ? "안전해요" : isCaution ? "주의하세요" : "위험해요"}
        </h2>
        
        <p className="text-xl font-medium text-gray-800 leading-relaxed mb-6 px-4">
          {result.summary}
        </p>
        
        <div className="w-full bg-white/60 rounded-2xl p-6 text-left shadow-sm backdrop-blur-sm">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">상세 처방</h3>
          <p className="text-gray-700 leading-relaxed text-lg">
            {result.details}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MessageCircle size={20} className="text-blue-500" />
          AI에게 추가 질문하기
        </h3>
        
        {answer && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 p-5 rounded-2xl mb-4 text-gray-800 leading-relaxed"
          >
            {answer}
          </motion.div>
        )}

        <form onSubmit={handleAsk} className="relative flex items-center">
          <input
            type="text"
            placeholder="예: 하루에 얼마나 먹어도 되나요?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isAsking}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-5 pr-14 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all focus:bg-white disabled:bg-gray-100 disabled:text-gray-400"
          />
          <button
            type="submit"
            disabled={!question.trim() || isAsking}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors disabled:text-gray-300 disabled:hover:bg-transparent"
          >
            {isAsking ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
          </button>
        </form>
      </div>

      {result.ingredients.length > 0 && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">주요 성분</h3>
          <div className="flex flex-wrap gap-2">
            {result.ingredients.map((ingredient, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-gray-50 text-gray-700 rounded-xl text-sm font-medium border border-gray-100"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full bg-gray-900 text-white py-4.5 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-[0.98] shadow-md mt-4"
      >
        <RefreshCw size={20} />
        다른 제품 스캔하기
      </button>
    </motion.div>
  );
}
