import AuthLayout from "@src/layouts/AuthLayout";
import Layout from "@src/layouts/Layout";
import { requireAuth } from "@src/lib/auth";
import ErrorPage from "@src/pages/ErrorPage";
import Home from "@src/pages/Home";
import Login from "@src/pages/Login";
import Register from "@src/pages/Register";
import User from "@src/pages/User";
import { createHashRouter } from "react-router-dom";

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Login />,
        index: true,
      },
      {
        element: <Register />,
        path: "/register",
      },
    ],
  },
  {
    path: "/home",
    element: <AuthLayout />,
    loader: requireAuth,
    children: [
      {
        element: <Home />,
        index: true,
      },
      {
        element: <User />,
        path: "user/:_id",
      },
    ],
  },
]);

export default router;
