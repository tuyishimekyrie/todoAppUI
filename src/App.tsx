import  { useEffect } from "react";
// import Signup from "./pages/Signup";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import { RootState } from "./state/store";
import { login } from "./state/counter/authSlice";
import Login from "./pages/Login";

export default function App() {
  const authValue = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const isAdmin = useSelector((state: RootState) => state.auth.user?.isAdmin);
  const dispatch = useDispatch();
  console.log(authValue?.isAdmin);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const isAdminString = localStorage.getItem("isAdmin");
      const isAdmin = isAdminString ? JSON.parse(isAdminString) : false;
      console.log(isAdmin);

      // Dispatch login action with user object
      dispatch(login({ token, isAdmin }));
    }
  }, [dispatch]);
  return (
    <>
      {isAuthenticated ? (
        isAdmin ? (
          <Dashboard />
        ) : (
          <UserDashboard />
        )
      ) : (
        // <Signup />
        <Login />
      )}
    </>
  );
}
