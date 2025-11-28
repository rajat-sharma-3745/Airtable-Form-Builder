
import React, { useState } from "react";
import ConditionalLogicEditor from "./ConditionalLogicEditor";

export default function QuestionEditor({ question, onUpdate, onRemove, allQuestions }) {
  const [openCond, setOpenCond] = useState(false);

  const handleToggleRequired = () => {
    onUpdate(question.questionKey, { required: !question.required });
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold text-gray-800">{question.label}</div>
          <div className="text-xs text-gray-500">{question.type} • {question.fieldId}</div>
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={handleToggleRequired} className={`px-2 py-1 rounded text-sm ${question.required ? "bg-red-100 text-red-600" : "bg-green-50 text-green-700"}`}>
            {question.required ? "Required" : "Optional"}
          </button>

          <button onClick={() => setOpenCond(s => !s)} className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded">Conditions</button>

          <button onClick={() => onRemove(question.questionKey)} className="px-2 py-1 bg-gray-100 rounded text-gray-700">Remove</button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input
          value={question.label}
          onChange={e => onUpdate(question.questionKey, { label: e.target.value })}
          className="p-2 border rounded"
        />
        {question.options?.length ? (
          <select
            className="p-2 border rounded"
            value={question.default || ""}
            onChange={e => onUpdate(question.questionKey, { default: e.target.value })}
          >
            <option value="">Default (none)</option>
            {question.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : (
          <div className="text-sm text-gray-400 p-2">No options</div>
        )}
      </div>

      {openCond && (
        <div className="mt-3">
          <ConditionalLogicEditor
            question={question}
            allQuestions={allQuestions}
            onChange={(rules) => onUpdate(question.questionKey, { conditionalRules: rules })}
          />
        </div>
      )}
    </div>
  );
}
