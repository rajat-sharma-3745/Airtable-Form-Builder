import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FieldRenderer from "../components/FieldRenderer";
import ConditionalWrapper from "../components/ConditionalWrapper";
// import { getFormById, submitForm } from "../services/formsApi";
import { shouldShowQuestion } from "../services/conditional";

export const dummyFormView = {
  _id: "form_001",
  title: "Job Application Form",
  airtableBaseId: "appBase123",
  airtableTableId: "tblJobs001",

  questions: [
    {
      questionKey: "fullName",
      label: "Full Name",
      type: "shortText",
      required: true,
      conditionalRules: null
    },
    {
      questionKey: "email",
      label: "Email Address",
      type: "shortText",
      required: true,
      conditionalRules: null
    },
    {
      questionKey: "role",
      label: "Select Role",
      type: "singleSelect",
      required: true,
      options: ["Engineer", "Designer", "Manager"],
      conditionalRules: null
    },
    {
      questionKey: "githubUrl",
      label: "GitHub Profile URL",
      type: "shortText",
      required: false,
      conditionalRules: {
        logic: "AND",
        conditions: [
          {
            questionKey: "role",
            operator: "equals",
            value: "Engineer"
          }
        ]
      }
    },
    {
      questionKey: "resume",
      label: "Upload Resume",
      type: "attachment",
      required: false,
      conditionalRules: null
    }
  ]
};


export default function FormView() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchForm() {
      try {
        // const res = await getFormById(formId);
        setForm(dummyFormView);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchForm();
  }, [formId]);

  const handleChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
    //   await submitForm(formId, answers);
      setSubmitted(true);
    } catch (err) {
      alert("Submission failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="bg-green-100 text-green-700 px-5 py-3 rounded-xl shadow">
          Form submitted successfully! 🎉
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{form.title}</h1>

      <div className="space-y-6">
        {form.questions.map((q) => {
          const visible = shouldShowQuestion(q.conditionalRules, answers);

          return (
            <ConditionalWrapper key={q.questionKey} visible={visible}>
              <FieldRenderer
                question={q}
                value={answers[q.questionKey] || ""}
                onChange={handleChange}
              />
            </ConditionalWrapper>
          );
        })}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-3 rounded-lg mt-8 text-lg font-semibold hover:bg-blue-700 transition shadow"
      >
        Submit Form
      </button>
    </div>
  );
}
