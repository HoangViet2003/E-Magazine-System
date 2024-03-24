import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  //   const { isAuth, isLoading } = useAuth();
  const isAuth = localStorage.getItem("isAuth");

  useEffect(() => {
    if (isAuth === "true") {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [isAuth, navigate]);

  if (isAuth === "true") return children;

  return null;
}
