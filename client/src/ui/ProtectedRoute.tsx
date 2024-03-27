import { ReactNode, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../redux/hooks/useAuth";
import Spinner from "./Spinner";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { isAuth, isLoading, setUserFromToken, user } = useAuth();
  const userToken = localStorage.getItem("user");
  const role = localStorage.getItem("role");

  console.log(role);

  const marketingCorRestrictedPaths = ["dashboard", "myFaculty"];

  useEffect(() => {
    if (userToken) {
      setUserFromToken(userToken);
    } else {
      navigate("/login");
    }
  }, []);

  if (
    role === "student" &&
    marketingCorRestrictedPaths.some((word) => location.pathname.includes(word))
  ) {
    return <Navigate to="/student" />;
  }

  if (isLoading)
    return (
      <div>
        <Spinner />
      </div>
    );

  return <>{children}</>;
}
