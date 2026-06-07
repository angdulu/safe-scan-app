import { useState, useEffect } from 'react';
import { UserProfile, AnalysisResult } from './types';
import { ProfileSetup } from './components/ProfileSetup';
import { Scanner } from './components/Scanner';
import { ResultCard } from './components/ResultCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Language, translations } from './translations';
import { Languages } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('ko');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [initialConditions, setInitialConditions] = useState<string[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Clean up Object URL when previewUrl changes to prevent memory leaks
  useEffect(() => {
    const url = previewUrl;
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [previewUrl]);

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  if (!profile) {
    return (
      <div className="relative bg-[#f2f4f6]">
        <button
          onClick={toggleLanguage}
          className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#e5e8eb] px-3 py-1.5 rounded-full text-xs font-bold text-[#191f28] shadow-sm hover:bg-white transition-all active:scale-95 cursor-pointer"
        >
          <Languages size={14} />
          {language === 'ko' ? 'English' : '한국어'}
        </button>
        <ProfileSetup 
          onComplete={(p) => { 
            setProfile(p); 
            setInitialConditions(p.conditions); 
          }} 
          language={language} 
          initialSelected={initialConditions}
        />
      </div>
    );
  }

  const handleResult = (res: AnalysisResult) => {
    setResult(res);
    setIsLoading(false);
    setPreviewUrl(null);
  };

  const handleLoading = (loading: boolean, url?: string) => {
    setIsLoading(loading);
    if (url) setPreviewUrl(url);
    if (!loading && !result) setPreviewUrl(null);
  };

  return (
    <div className="min-h-screen bg-[#f2f4f6] text-[#191f28] font-sans pb-24">
      <header className="px-6 pt-6 pb-5 bg-white shadow-sm rounded-b-3xl mb-6 sticky top-0 z-10 flex justify-between items-start border-b border-[#e5e8eb]">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#191f28]">SafeScan</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <p className="text-[#3182f6] font-semibold text-base">
              {profile.conditions.join(', ')} {t.header_subtitle}
            </p>
            <button
              onClick={() => setProfile(null)}
              className="text-xs text-[#8b95a1] hover:text-[#3182f6] transition-colors font-medium border-b border-[#8b95a1]/30 hover:border-[#3182f6]/30 cursor-pointer pb-0.5 ml-1"
            >
              {language === 'ko' ? '수정' : 'Edit'}
            </button>
          </div>
        </div>
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 bg-[#f2f4f6] border border-[#e5e8eb] px-3 py-1.5 rounded-full text-xs font-bold text-[#191f28] hover:bg-white transition-all active:scale-95 cursor-pointer"
        >
          <Languages size={14} />
          {language === 'ko' ? 'English' : '한국어'}
        </button>
      </header>
      
      <main className="px-4 max-w-md mx-auto">
        {isLoading ? (
          <LoadingSpinner imageUrl={previewUrl} language={language} />
        ) : result ? (
          <ResultCard profile={profile} result={result} onReset={() => setResult(null)} language={language} />
        ) : (
          <Scanner profile={profile} onResult={handleResult} onLoading={handleLoading} language={language} />
        )}
      </main>
    </div>
  );
}
