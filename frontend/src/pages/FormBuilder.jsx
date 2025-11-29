import React, { useEffect, useState } from "react";
import TableSelector from "../components/TableSelector";
import FieldSelector from "../components/FieldSelector";
import QuestionEditor from "../components/QuestionEditor";
import FormSummary from "../components/FormSummary";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { LuLoaderCircle } from "react-icons/lu";

export default function FormBuilder() {
  const { baseId } = useParams();
  const [title, setTitle] = useState("");
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [fields, setFields] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [fieldLoading, setFieldLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadTables() {
      try {
        setTableLoading(true);
        const { data } = await axiosInstance.get(API_PATHS.FORM.TABLES(baseId));
        setTables(data);
        if (data.length) setSelectedTable(data[0].id);
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message ||
          "Something went wrong")
      } finally {
        setTableLoading(false);
      }
    }
    loadTables();
  }, [baseId]);

  useEffect(() => {
    async function loadFields() {
      try {
        setFieldLoading(true);
        if (!selectedTable) return;
        const { data } = await axiosInstance.get(
          API_PATHS.FORM.TABLE_FIELDS(baseId, selectedTable)
        );
        setFields(data);
        setSelectedQuestions([]);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Something went wrong"
        );
      } finally {
        setFieldLoading(false);
      }
    }
    loadFields();
  }, [selectedTable]);

  async function saveForm() {
    if(!title || selectedQuestions.length===0) {
      toast.warning('Please fill the title and questions')
      return;
    }
    try {
      setIsSaving(true);
      const {data} = await axiosInstance.post(API_PATHS.FORM.CREATE,{title,questions:selectedQuestions,baseId,tableId:selectedTable})
      if(data){
        toast.success(data?.message)
        navigate('/my-forms');
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message ||
          "Something went wrong")
    } finally {
      setIsSaving(false);
    }
  }

  const addFieldAsQuestion = (field) => {
    const key = field.id;
    setSelectedQuestions((prev) => {
      if (prev.find((p) => p.questionKey === key)) return prev;
      return [
        ...prev,
        {
          questionKey: key,
          fieldId: field.id,
          label: field.name,
          type: field.type,
          required: false,
          options: field.options || [],
          conditionalRules: null,
        },
      ];
    });
  };

  const updateQuestion = (questionKey, update) => {
    setSelectedQuestions((prev) =>
      prev.map((q) => (q.questionKey === questionKey ? { ...q, ...update } : q))
    );
  };

  const removeQuestion = (questionKey) => {
    setSelectedQuestions((prev) =>
      prev.filter((q) => q.questionKey !== questionKey)
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Form Builder</h1>
            <p className="text-gray-600">
              Create a form from a table (table selector provided).
            </p>
          </div>
          <div>
            <button
              className="px-4 py-2 bg-indigo-600 cursor-pointer text-white rounded-md shadow hover:bg-indigo-700"
              onClick={saveForm}
            >
              {isSaving?<LuLoaderCircle className="text-center animate-spin"/>:"Save Form"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TableSelector
              tables={tables}
              selected={selectedTable}
              onSelect={setSelectedTable}
              loading={tableLoading}
            />

            <div className="mt-6">
              <FieldSelector
                fields={fields}
                selectedTable={selectedTable}
                onAdd={addFieldAsQuestion}
                loading={fieldLoading}
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-4 mb-6">
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-1">
                  Form Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a name for your form"
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Questions
              </h2>

              {selectedQuestions.length === 0 ? (
                <div className="p-8 border-2 border-dashed border-gray-200 rounded text-center text-gray-500">
                  No questions yet — add fields from the left to begin.
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedQuestions.map((q) => (
                    <QuestionEditor
                      key={q.questionKey}
                      question={q}
                      allQuestions={selectedQuestions}
                      onUpdate={updateQuestion}
                      onRemove={() => removeQuestion(q.questionKey)}
                    />
                  ))}
                </div>
              )}
            </div>

            <FormSummary
              formTitle={`Form from ${selectedTable || "Table"}`}
              questions={selectedQuestions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
