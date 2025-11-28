export default function FieldRenderer({ question, value, onChange }) {
  const { label, questionKey, type, options } = question;

  const handleInput = (e) => {
    onChange(questionKey, e.target.value);
  };

  return (
    <div className="flex flex-col">
      <label className="font-medium text-gray-800 mb-1">{label}</label>

      {type === "shortText" && (
        <input
          type="text"
          value={value}
          onChange={handleInput}
          className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      )}

      {type === "longText" && (
        <textarea
          value={value}
          onChange={handleInput}
          className="border rounded-lg p-3 h-28 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      )}

      {type === "singleSelect" && (
        <select
          value={value}
          onChange={handleInput}
          className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Select...</option>
          {options?.map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
      )}

      {type === "multiSelect" && (
        <div className="grid grid-cols-2 gap-2">
          {options?.map((op) => (
            <label key={op} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={value?.includes(op)}
                onChange={() => {
                  let newVal = value || [];
                  newVal = newVal.includes(op)
                    ? newVal.filter((x) => x !== op)
                    : [...newVal, op];
                  onChange(questionKey, newVal);
                }}
              />
              {op}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
