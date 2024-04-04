import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoutes = ({ children }: PropsWithChildren<object>) => {
  const navigate = useNavigate();

  useEffect(() => {
    const tokenData = localStorage.getItem("token");
    if (!tokenData) {
      navigate("/login");
    } else {
      const admin = localStorage.getItem("isAdmin");
      if (admin === "true") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    }
  }, [navigate]); 

  return <>{children}</>;
};

export default ProtectedRoutes;
