export default function TableSelector({ tables = [], selected, onSelect,loading }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Select Table</h3>
      <div className="space-y-2">
        {loading?(
          <div className="flex justify-center items-center ">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        </div>
        )
        :tables.length === 0 ? (
          <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md">
            <h3 className="font-semibold text-lg">No Tables Found</h3>
            <p className="text-sm mt-1">
              This Airtable base doesn't have any tables yet. Please go to{" "}
              <span className="font-medium">Airtable → Add Table</span>
              and then refresh this page.
            </p>
          </div>
        ) : (
          tables?.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={`w-full text-left px-3 cursor-pointer py-2 rounded-md hover:bg-gray-50 transition ${
                selected === t.id
                  ? "bg-indigo-50 border-l-4 border-indigo-500"
                  : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.id}</div>
                </div>
                <div className="text-indigo-500 font-semibold">
                  {selected === t.id ? "Selected" : "Select"}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
