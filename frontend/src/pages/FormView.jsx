import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FieldRenderer from "../components/FieldRenderer";
import ConditionalWrapper from "../components/ConditionalWrapper";
import { shouldShowQuestion } from "../services/conditional";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { LuLoaderCircle } from "react-icons/lu";
import { toast } from "sonner";
import { validateForm } from "../services/validator";


export default function FormView() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchForm() {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(
          API_PATHS.FORM.GET_FORM(formId)
        );
        setForm(data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Something went wrong"
        );
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
      const validation = validateForm(form.questions, answers);
      if (!validation.ok) {
        toast.info(validation.message);
        return;
      }
      setIsSubmitting(true);
      const { data } = await axiosInstance.post(
        API_PATHS.RESPONSE.SUBMIT(formId),
        { answers }
      );
      if (data?.success) {
        setSubmitted(true);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
      setAnswers({});
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
        disabled={isSubmitting}
        className="w-full bg-blue-600 cursor-pointer flex justify-center disabled:cursor-not-allowed disabled:bg-blue-400 text-white py-3 rounded-lg mt-8 text-lg font-semibold hover:bg-blue-700 transition shadow"
      >
        {isSubmitting ? (
          <LuLoaderCircle className="animate-spin" />
        ) : (
          "Submit Form"
        )}
      </button>
    </div>
  );
}
