import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { GrStatusWarning } from "react-icons/gr";
import { toast } from "sonner";
import { useAppContext } from "../Context/AppContext";
const dummyBases = [
  {
    id: "app123ABC",
    name: "Hiring Database",
  },
  {
    id: "app456DEF",
    name: "Product Feedback",
  },
  {
    id: "app789GHI",
    name: "Event Registrations",
  },
  {
    id: "app999XYZ",
    name: "Content Calendar",
  },
];

const Dashboard = () => {
  const {logout}  = useAppContext()
  const [bases, setBases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBases() {
      try {
        const { data } = await axiosInstance.get(API_PATHS.FORM.BASES);
        setBases(data);
      } catch (error) {
        setError("Failed to load Airtable bases.");
        toast.error(
          error?.response?.data?.message ||
            error?.message||"Something went wrong"
        );
        if(error?.response?.status===401){
           logout();
        }
      } finally {
        setLoading(false);
      }
    }
    fetchBases();
  }, []);

  if (loading) {
    return (
      <div className="p-2 max-w-6xl mx-auto">
        {loading && (
          <div className="mt-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm flex items-center gap-2">
            <GrStatusWarning />
            <span>
              Our server is waking up — this may take a few seconds since it's
              hosted on Render.
            </span>
          </div>
        )}
        <div className="flex justify-center items-center h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        </div>
      </div>
    );
  }
  if (!loading && bases.length === 0) {
    return (
      <div className="flex justify-center items-center h-[80vh] flex-col">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          No Airtable bases found in your account.
        </h2>
        <p className="text-gray-500">
          Please create a base in Airtable and try again.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">
        Your Airtable Bases
      </h1>
      <p className="text-gray-600 mb-6">
        Select a base to create a form from one of its tables.
      </p>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {bases.map((base) => (
          <div
            key={base.id}
            className="bg-white shadow-lg rounded-xl p-5 border border-gray-100 hover:shadow-xl transition cursor-pointer"
            onClick={() => navigate(`/form-builder/${base.id}`)}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {base.name}
            </h2>
            <p className="text-gray-500 text-sm">Base ID: {base.id}</p>
          </div>
        ))}

        {/* Create Form Button */}
        {/* <div
          className="bg-linear-to-br from-blue-600 to-blue-700 shadow-lg rounded-xl p-5 text-white flex flex-col justify-center items-center hover:shadow-xl transition cursor-pointer"
          onClick={() => navigate("/create-form")}
        >
          <span className="text-4xl font-bold">+</span>
          <p className="mt-2">Create Form</p>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
