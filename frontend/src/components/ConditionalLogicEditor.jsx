// src/components/ConditionalLogicEditor.jsx
import React, { useState } from "react";

/**
 * Props:
 *  - question (the question being edited)
 *  - allQuestions (list of existing questions to reference)
 *  - onChange(rules) called with ConditionalRules or null
 */
export default function ConditionalLogicEditor({ question, allQuestions, onChange }) {
  const [logic, setLogic] = useState(question.conditionalRules?.logic || "AND");
  const [conditions, setConditions] = useState(question.conditionalRules?.conditions || []);

  function addCondition() {
    setConditions(prev => [...prev, { questionKey: allQuestions[0]?.questionKey || "", operator: "equals", value: "" }]);
  }

  function updateCondition(idx, patch) {
    setConditions(prev => prev.map((c,i) => i === idx ? {...c, ...patch} : c));
  }

  function removeCondition(idx) {
    setConditions(prev => prev.filter((c,i)=>i!==idx));
  }

  function applyRules() {
    if (!conditions.length) {
      onChange(null);
      return;
    }
    onChange({ logic, conditions });
  }

  return (
    <div className="bg-white p-3 border rounded">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">Conditional Logic</div>
        <div>
          <select value={logic} onChange={e => setLogic(e.target.value)} className="p-1 border rounded ml-2">
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        {conditions.map((c, idx) => (
          <div key={idx} className="grid grid-cols-3 gap-2 items-center">
            <select value={c.questionKey} onChange={e => updateCondition(idx, { questionKey: e.target.value })} className="p-2 border rounded">
              {allQuestions.map(q => <option key={q.questionKey} value={q.questionKey}>{q.label}</option>)}
            </select>

            <select value={c.operator} onChange={e => updateCondition(idx, { operator: e.target.value })} className="p-2 border rounded">
              <option value="equals">equals</option>
              <option value="notEquals">not equals</option>
              <option value="contains">contains</option>
            </select>

            <input value={c.value} onChange={e => updateCondition(idx, { value: e.target.value })} className="p-2 border rounded" />
            <div className="col-span-3 flex justify-end space-x-2 mt-1">
              <button onClick={() => removeCondition(idx)} className="text-sm text-red-500">Remove</button>
            </div>
          </div>
        ))}

        <div className="flex items-center space-x-2 mt-2">
          <button onClick={addCondition} className="px-3 py-1 bg-indigo-600 text-white rounded">Add Condition</button>
          <button onClick={applyRules} className="px-3 py-1 bg-green-50 text-green-700 rounded">Apply</button>
        </div>
      </div>
    </div>
  );
}
