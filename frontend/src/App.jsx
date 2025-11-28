import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAppContext } from "./Context/AppContext";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Loader from "./components/Loader";
import FormBuilder from "./pages/FormBuilder";
import MyForms from "./pages/MyForms";
import FormView from "./pages/FormView";
import ResponsesList from "./pages/ResponsesList";

function App() {
   const { user } = useAppContext();
  const router = createBrowserRouter([
    {
      path: "/auth",
      element: (
        <ProtectedRoute user={!user} redirect="/">
          <Login />
        </ProtectedRoute>
      ),
    },
    {
      path:'/loader',
      element:<Loader/>
    },
    {
      path: "/",
      element: (
        <ProtectedRoute user={user}>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        {
          path: "/form-builder/:baseId",
          element: <FormBuilder />,
        },
        {
          path: "/my-forms",
          element: <MyForms />,
        },
        {
          path: "/form/:formId",
          element: <FormView />,
        },
        {
          path: "/forms/:formId/responses",
          element: <ResponsesList />,
        },
       
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
