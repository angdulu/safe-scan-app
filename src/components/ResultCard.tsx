import React, { useState } from "react";
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, MessageCircle, Send, Loader2 } from "lucide-react";
import { AnalysisResult, UserProfile } from "../types";
import { motion } from "motion/react";
import { askFollowUpQuestion } from "../services/analyzer";
import { Language, translations } from "../translations";

interface ResultCardProps {
  profile: UserProfile;
  result: AnalysisResult;
  onReset: () => void;
  language: Language;
}

interface Message {
  role: "user" | "ai";
  content: string;
}

export function ResultCard({ profile, result, onReset, language }: ResultCardProps) {
  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const chatRef = React.useRef<HTMLDivElement>(null);
  const t = translations[language];

  React.useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isAsking]);

  const isSafe = result.level === "SAFE";
  const isCaution = result.level === "CAUTION";

  const getStatusText = () => {
    if (language === 'ko') {
      return isSafe ? "안전해요" : isCaution ? "주의하세요" : "위험해요";
    }
    return isSafe ? "Safe" : isCaution ? "Watch Out" : "Danger";
  };

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
    const currentQuestion = question.trim();
    if (!currentQuestion || isAsking) return;

    setIsAsking(true);
    setQuestion("");
    
    // Add user message immediately
    const newUserMessage: Message = { role: "user", content: currentQuestion };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      const response = await askFollowUpQuestion(profile, result, currentQuestion, language, messages);
      const newAiMessage: Message = { role: "ai", content: response };
      setMessages(prev => [...prev, newAiMessage]);
    } catch (error) {
      console.error(error);
      alert(language === 'ko' ? "질문에 답변하는 중 오류가 발생했습니다." : "An error occurred while answering the question.");
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
          {getStatusText()}
        </h2>
        
        <p className="text-xl font-medium text-gray-800 leading-relaxed mb-6 px-4">
          {result.summary}
        </p>
        
        <div className="w-full bg-white/60 rounded-2xl p-6 text-left shadow-sm backdrop-blur-sm">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">{t.result_details_label}</h3>
          <p className="text-gray-700 leading-relaxed text-lg">
            {result.details}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MessageCircle size={20} className="text-blue-500" />
          {t.result_chat_title}
        </h3>
        
        <div 
          ref={chatRef}
          className="flex flex-col gap-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar scroll-smooth"
        >
          {messages.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">{t.result_chat_empty}</p>
          ) : (
            messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                  msg.role === "user" 
                    ? "bg-blue-500 text-white rounded-tr-none" 
                    : "bg-gray-100 text-gray-800 rounded-tl-none"
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))
          )}
          {isAsking && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-gray-400" />
                <span className="text-xs text-gray-400 font-medium tracking-tight">{t.result_chat_thinking}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4 px-1">
          <button
            type="button"
            onClick={() => {
              setQuestion(t.result_chat_suggestion1);
            }}
            className="text-[11px] bg-gray-50 text-gray-600 px-3 py-2 rounded-xl border border-gray-100 font-semibold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all active:scale-95"
          >
            {t.result_chat_suggestion1}
          </button>
          <button
            type="button"
            onClick={() => {
              setQuestion(t.result_chat_suggestion2);
            }}
            className="text-[11px] bg-gray-50 text-gray-600 px-3 py-2 rounded-xl border border-gray-100 font-semibold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all active:scale-95"
          >
            {t.result_chat_suggestion2}
          </button>
        </div>

        <form onSubmit={handleAsk} className="relative flex items-center">
          <input
            type="text"
            placeholder={t.result_chat_placeholder}
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
            <Send size={24} />
          </button>
        </form>
      </div>

      {result.ingredients.length > 0 && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">{t.result_ingredients_label}</h3>
          <div className="flex flex-wrap justify-center gap-2">
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
        {t.result_reset_btn}
      </button>

      <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 mt-2">
        <h4 className="text-xs font-bold text-gray-600 mb-2 flex items-center gap-1.5">
          <AlertTriangle size={14} />
          {language === 'ko' ? '필수 법적 고지 사항' : 'Essential Legal Disclaimer'}
        </h4>
        <ul className="text-[11px] text-gray-500 space-y-1.5 list-disc pl-4 leading-relaxed">
          {language === 'ko' ? (
            <>
              <li>본 서비스는 Gemini AI 모델을 기반으로 하며, 사진 판독 오류나 최신 정보 미반영으로 인해 결과가 100% 정확하지 않을 수 있습니다.</li>
              <li>분석 결과는 참고용일 뿐 전문의의 진단이나 의학적 조언을 대체할 수 없습니다. 질환이 있는 경우 반드시 전문가와 상의하십시오.</li>
              <li>사용자가 업로드한 사진은 AI 분석을 위해 구글 서버(API)로 전송되며, 이는 개인정보 보호법에 따른 제3자 제공에 해당합니다.</li>
            </>
          ) : (
            <>
              <li>This service is based on the Gemini AI model. Results may not be 100% accurate due to image reading errors or failure to reflect the latest information.</li>
              <li>Analysis results are for reference only and cannot replace professional diagnosis or medical advice. Consult a specialist if you have a medical condition.</li>
              <li>Photos uploaded by users are sent to Google servers (API) for AI analysis, which represents third-party provision under data protection laws.</li>
            </>
          )}
        </ul>
      </div>
    </motion.div>
  );
}
