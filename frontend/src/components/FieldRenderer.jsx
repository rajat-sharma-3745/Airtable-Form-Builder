export default function FieldRenderer({ question, value, onChange }) {
  const { label, questionKey, type, options, required } = question;

  const handleInput = (e) => {
    onChange(questionKey, e.target.value);
  };

  return (
    <div className="flex flex-col">

      <label className="font-medium text-gray-800 mb-1 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      {type === "singleLineText" && (
        <input
          type="text"
          value={value}
          onChange={handleInput}
          required={required}
          className={`border rounded-lg p-3 focus:ring-2 outline-none ${
            required ? "focus:ring-red-500" : "focus:ring-blue-500"
          }`}
        />
      )}
      {type === "multiLineText" && (
        <textarea
          value={value}
          onChange={handleInput}
          required={required}
          className={`border rounded-lg p-3 h-28 focus:ring-2 outline-none ${
            required ? "focus:ring-red-500" : "focus:ring-blue-500"
          }`}
        />
      )}

      {type === "singleSelect" && (
        <select
          value={value}
          onChange={handleInput}
          required={required}
          className={`border rounded-lg p-3 focus:ring-2 outline-none ${
            required ? "focus:ring-red-500" : "focus:ring-blue-500"
          }`}
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
        <div className="grid grid-cols-2 gap-2 border rounded-lg p-3">
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

          {required && (!value || value.length === 0) && (
            <p className="text-xs text-red-500 col-span-2">
              * This field is required
            </p>
          )}
        </div>
      )}

      {type === "attachment" && (
        <div className="flex flex-col gap-3 border rounded-lg p-3">
          <label className="block">
            <span className="text-gray-700 font-medium">
              Upload Files {required && <span className="text-red-500">*</span>}
            </span>

            <input
              type="file"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files);
                onChange(questionKey, files);
              }}
              className="mt-1 block w-full text-sm text-gray-600
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
            />
          </label>

          {Array.isArray(value) && value.length > 0 && (
            <div className="space-y-1">
              {value.map((file, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm bg-gray-100 px-3 py-1 rounded-md"
                >
                  <span>{file.name}</span>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => {
                      const newFiles = value.filter((_, i) => i !== idx);
                      onChange(questionKey, newFiles);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {required && (!value || value.length === 0) && (
            <p className="text-xs text-red-500">
              * At least one file is required
            </p>
          )}
        </div>
      )}
    </div>
  );
}
