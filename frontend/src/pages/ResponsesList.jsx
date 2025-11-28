// src/pages/ResponsesList.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


export const dummyResponses = [
  {
    _id: "sub_001",
    createdAt: "2025-02-10",
    answers: {
      name: "John Doe",
      email: "john@example.com",
      role: "Engineer",
      github: "https://github.com/johndoe",
    },
  },
  {
    _id: "sub_002",
    createdAt: "2025-02-11",
    answers: {
      name: "Sara Smith",
      email: "sara@example.com",
      role: "Designer",
      github: null,
    },
  },
];

export default function ResponsesList() {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResponses() {
      try {
        // const res = await getResponses(formId);
        setResponses(dummyResponses);
      } catch (err) {
        setError("Unable to load responses.");
      } finally {
        setLoading(false);
      }
    }
    loadResponses();
  }, [formId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 text-xl">{error}</div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Responses ({responses.length})
      </h1>

      {responses.length === 0 ? (
        <p className="text-gray-600">No responses submitted yet.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {responses.map((res) => (
            <div
              key={res._id}
              className="bg-white p-5 shadow rounded-xl border border-gray-100 hover:shadow-md transition"
            >
              <h2 className="font-semibold text-gray-800 mb-2">
                Submission ID: {res._id.slice(-6)}
              </h2>

              <p className="text-sm text-gray-600 mb-1">
                Airtable ID: {res.airtableRecordId}
              </p>

              <p className="text-sm text-gray-600 mb-3">
                Created: {new Date(res.createdAt).toLocaleString()}
              </p>

              <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700 h-32 overflow-auto">
                <pre className="whitespace-pre-wrap text-xs">
                  {JSON.stringify(res.answers, null, 2)}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
