import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAppContext } from "./Context/AppContext";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Loader from "./components/Loader";

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
       
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
