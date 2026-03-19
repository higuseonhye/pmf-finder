import { useState } from 'react';

export default function Landing({ onStart, onDemo }) {
  const [lang, setLang] = useState('en');
  const t = lang === 'ko' ? {
    tagline: '실리콘밸리 없이 PMF를 찾다',
    subtitle: 'AI 에이전트가 인터뷰를 진행하고, 결과만 받아보세요.',
    startFree: '무료로 시작',
    tryDemo: '데모 체험',
    features: [
      '고객이 링크만 열면 폼 작성',
      '트랜스크립트 붙여넣기 → 자동 추출',
      '업종별 벤치마크 비교',
      'PMF 점수 자동 계산',
    ],
  } : {
    tagline: 'Find PMF without Silicon Valley',
    subtitle: 'AI agent conducts interviews. You just see results.',
    startFree: 'Start free',
    tryDemo: 'Try demo',
    features: [
      'Customer opens link → completes form',
      'Paste transcript → auto-extract',
      'Industry benchmarks',
      'PMF score calculated',
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
          className="text-sm text-gray-500 hover:underline"
        >
          {lang === 'ko' ? 'English' : '한국어'}
        </button>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
          For founders outside Silicon Valley
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {t.tagline}
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          {t.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={onStart}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 shadow-lg"
          >
            {t.startFree}
          </button>
          <button
            onClick={onDemo}
            className="px-8 py-4 border-2 border-gray-300 rounded-lg font-semibold text-lg hover:bg-gray-50"
          >
            {t.tryDemo}
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-left">
          {t.features.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-lg border shadow-sm">
              <span className="text-green-500 text-xl">✓</span>
              <span>{f}</span>
            </div>
          ))}
        </div>
        <p className="mt-12 text-sm text-gray-500">
          No signup. Data stays in your browser.
        </p>
      </div>
    </div>
  );
}
