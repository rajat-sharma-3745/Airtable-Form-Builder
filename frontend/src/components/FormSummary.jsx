// src/components/FormSummary.jsx
import React from "react";

export default function FormSummary({ formTitle = "Untitled", questions = [] }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{formTitle}</h3>
          <div className="text-sm text-gray-500">Preview of the form schema</div>
        </div>
        <div className="text-sm text-gray-500">{questions.length} questions</div>
      </div>

      <div className="space-y-3">
        {questions.map((q) => (
          <div key={q.questionKey} className="p-3 border rounded">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">{q.label}</div>
                <div className="text-xs text-gray-500">{q.type} • {q.fieldId}</div>
              </div>
              <div className="text-sm text-gray-600">{q.required ? "Required" : "Optional"}</div>
            </div>

            {q.conditionalRules && (
              <div className="mt-2 text-xs text-indigo-700 bg-indigo-50 p-2 rounded">
                {q.conditionalRules.logic} when:
                <ul className="ml-4">
                  {q.conditionalRules.conditions.map((c,i) => (
                    <li key={i}>{c.questionKey} {c.operator} {String(c.value)}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

        {questions.length === 0 && <div className="text-gray-400">No questions added yet.</div>}
      </div>
    </div>
  );
}
