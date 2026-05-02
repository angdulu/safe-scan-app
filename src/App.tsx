import { useState } from 'react';
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
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  if (!profile) {
    return (
      <div className="relative">
        <button
          onClick={toggleLanguage}
          className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 px-3 py-1.5 rounded-full text-xs font-bold text-gray-600 shadow-sm hover:bg-white transition-all active:scale-95"
        >
          <Languages size={14} />
          {language === 'ko' ? 'English' : '한국어'}
        </button>
        <ProfileSetup onComplete={setProfile} language={language} />
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
    <div className="min-h-screen bg-[#f2f4f6] text-gray-900 font-sans pb-24">
      <header className="px-6 pt-6 pb-5 bg-white shadow-sm rounded-b-3xl mb-6 sticky top-0 z-10 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">SafeScan</h1>
          <p className="text-blue-500 font-medium mt-1 text-base">
            {profile.conditions.join(', ')} {t.header_subtitle}
          </p>
        </div>
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full text-xs font-bold text-gray-600 hover:bg-white transition-all active:scale-95"
        >
          <Languages size={14} />
          {language === 'ko' ? 'English' : '한국어'}
        </button>
      </header>
      
      <main className="px-6 max-w-md mx-auto">
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
