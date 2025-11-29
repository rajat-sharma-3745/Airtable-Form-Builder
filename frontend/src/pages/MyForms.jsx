import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export default function MyForms() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchForms() {
      try {
        setLoading(true)
        const {data} = await axiosInstance.get(API_PATHS.FORM.GETUSERFORMS)
        setForms(data);
      } catch (err) {
        setError("Failed to load your forms");
      } finally {
        setLoading(false);
      }
    }
    fetchForms();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">My Forms</h1>

      {forms.length === 0 && (
        <p className="text-gray-500 text-lg">You haven't created any forms yet.</p>
      )}

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map((form) => (
          <div
            key={form._id}
            className="bg-white shadow-md rounded-xl p-5 border hover:shadow-xl transition cursor-pointer"
            onClick={() => navigate(`/form/${form._id}`)}
          >
            <h2 className="text-xl font-semibold text-gray-900">{form.title}</h2>
            <p className="text-gray-500 text-sm mt-2">
              Base: {form.baseId}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Table: {form.tableId}
            </p>
             <p className="text-xs text-gray-400 mt-2">
              Created: {new Date(form.createdAt).toLocaleDateString()}
            </p>


            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/forms/${form._id}/responses`);
              }}
              className="mt-4 w-full cursor-pointer bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
            >
              View Responses
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
