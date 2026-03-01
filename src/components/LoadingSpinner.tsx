import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-8 shadow-inner animate-pulse">
        <Loader2 size={48} className="text-blue-500 animate-spin" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        성분을 분석하고 있어요
      </h2>
      <p className="text-gray-500 text-lg">
        잠시만 기다려주세요...
      </p>
    </div>
  );
}
