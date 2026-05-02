import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { Language, translations } from "../translations";

interface LoadingSpinnerProps {
  imageUrl?: string | null;
  language: Language;
}

export function LoadingSpinner({ imageUrl, language }: LoadingSpinnerProps) {
  const t = translations[language];

  return (
    <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
      {imageUrl ? (
        <div className="relative w-full max-w-[280px] aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-xl mb-10 bg-gray-50 border-[6px] border-white ring-1 ring-black/5">
          <img 
            src={imageUrl} 
            alt="Scanning preview" 
            className="w-full h-full object-contain bg-gray-50"
            referrerPolicy="no-referrer"
          />
          
          {/* Modern Scanning Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Subtle darken overlay */}
            <div className="absolute inset-0 bg-black/5" />
            
            {/* Scanning Line - Thinner and more elegant */}
            <motion.div 
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent z-20"
              initial={{ top: "0%" }}
              animate={{ top: "100%" }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            
            {/* Scanning Beam/Glow - More subtle and wider */}
            <motion.div 
              className="absolute left-0 right-0 h-32 bg-gradient-to-b from-blue-400/0 via-blue-400/10 to-blue-400/0 z-10"
              initial={{ top: "-20%" }}
              animate={{ top: "100%" }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />

            {/* Corner Brackets for a "Scanner" feel */}
            <div className="absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 border-blue-400/50 rounded-tl-sm" />
            <div className="absolute top-6 right-6 w-4 h-4 border-t-2 border-r-2 border-blue-400/50 rounded-tr-sm" />
            <div className="absolute bottom-6 left-6 w-4 h-4 border-b-2 border-l-2 border-blue-400/50 rounded-bl-sm" />
            <div className="absolute bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 border-blue-400/50 rounded-br-sm" />
          </div>
        </div>
      ) : (
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
          <Loader2 size={40} className="text-blue-500 animate-spin" />
        </div>
      )}
      
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-900">
          {imageUrl ? t.loading_camera : t.loading_text}
        </h2>
        <p className="text-gray-400 text-base font-medium animate-pulse">
          {t.loading_desc}
        </p>
      </div>
    </div>
  );
}
