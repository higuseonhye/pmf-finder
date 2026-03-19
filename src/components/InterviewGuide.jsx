import { FRAMEWORKS, QUICK_QUESTIONS } from '../data/interviewTemplates';

export default function InterviewGuide() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Interview Guide</h2>
        <p className="text-gray-600 text-sm">
          Use these proven frameworks during customer interviews. Copy questions into your notes.
        </p>
      </div>

      <div className="space-y-6">
        {Object.values(FRAMEWORKS).map((fw) => (
          <div key={fw.id} className="border border-gray-200 rounded-lg p-4 bg-white">
            <h3 className="font-semibold text-gray-900 mb-1">{fw.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{fw.description}</p>
            <ul className="space-y-3">
              {fw.questions.map((q) => (
                <li key={q.id} className="flex flex-col gap-1">
                  <div className="font-medium text-gray-800">{q.question}</div>
                  {q.options && (
                    <div className="text-sm text-gray-500">
                      Options: {q.options.join(' / ')}
                    </div>
                  )}
                  {q.tip && (
                    <div className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-1 inline-block">
                      {q.tip}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <h3 className="font-semibold text-gray-900 mb-2">Quick Questions (any interview)</h3>
        <ul className="space-y-2">
          {QUICK_QUESTIONS.map((q, i) => (
            <li key={i} className="text-gray-700">{q}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
