import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import UserDashboard from "./pages/UserDashboard.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import { Provider } from "react-redux";
import { store } from "./state/store.ts";
import Signup from "./pages/Signup.tsx";
import ProtectedRoutes from "./routes/ProtectedRoutes.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoutes>
        <Dashboard />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/user",
    element: (
      <ProtectedRoutes>
        <UserDashboard />
      </ProtectedRoutes>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
    {/* <App /> */}
  </React.StrictMode>
);
