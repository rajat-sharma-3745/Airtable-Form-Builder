

export default function TableSelector({ tables = [], selected, onSelect }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Select Table</h3>
      <div className="space-y-2">
        {tables.map(t => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition ${selected === t.id ? "bg-indigo-50 border-l-4 border-indigo-500" : "bg-white"}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-800">{t.name}</div>
                <div className="text-xs text-gray-400">{t.id}</div>
              </div>
              <div className="text-indigo-500 font-semibold">{selected === t.id ? "Selected" : "Select"}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
