import { useState } from 'react';
import { UserProfile, AnalysisResult } from './types';
import { ProfileSetup } from './components/ProfileSetup';
import { Scanner } from './components/Scanner';
import { ResultCard } from './components/ResultCard';
import { LoadingSpinner } from './components/LoadingSpinner';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!profile) {
    return <ProfileSetup onComplete={setProfile} />;
  }

  return (
    <div className="min-h-screen bg-[#f2f4f6] text-gray-900 font-sans pb-24">
      <header className="px-6 pt-6 pb-5 bg-white shadow-sm rounded-b-3xl mb-6 sticky top-0 z-10">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">SafeScan</h1>
        <p className="text-blue-500 font-medium mt-1 text-base">
          {profile.conditions.join(', ')} 맞춤 분석
        </p>
      </header>
      
      <main className="px-6 max-w-md mx-auto">
        {isLoading ? (
          <LoadingSpinner />
        ) : result ? (
          <ResultCard profile={profile} result={result} onReset={() => setResult(null)} />
        ) : (
          <Scanner profile={profile} onResult={setResult} onLoading={setIsLoading} />
        )}
      </main>
    </div>
  );
}
