// src/components/FieldSelector.jsx
import React from "react";

function TypeBadge({ type }) {
  const map = {
    shortText: "Short",
    longText: "Long",
    singleSelect: "Single",
    multiSelect: "Multi",
    attachment: "File"
  };
  return <span className="inline-block text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">{map[type] || type}</span>;
}

export default function FieldSelector({ fields = [], onAdd }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Fields</h3>

      <div className="space-y-3">
        {fields.map(f => (
          <div key={f.id} className="flex items-center justify-between border p-3 rounded hover:shadow-sm transition">
            <div>
              <div className="font-medium text-gray-800">{f.name}</div>
              <div className="text-xs text-gray-400 mt-1">{f.id} • <TypeBadge type={f.type} /></div>
              {f.options?.length ? <div className="text-xs text-gray-500 mt-2">Options: {f.options.join(", ")}</div> : null}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onAdd(f)}
                className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
          </div>
        ))}
        {fields.length === 0 && <div className="text-gray-400 text-sm">No fields found for this table.</div>}
      </div>
    </div>
  );
}
