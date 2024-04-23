import { ReactNode, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../redux/hooks/useAuth";
import Spinner from "./Spinner";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { isLoading, setUserFromToken } = useAuth();
  const userToken = localStorage.getItem("user");
  const role = localStorage.getItem("role");

  const marketingCorRestrictedPaths = ["dashboard", "myFaculty"];
  const guestRestrictedPaths = ["myFaculty"];

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

  // if (role === "marketing manager" && location.pathname.includes("dashboard")) {
  //   return <Navigate to="/myFaculty" />;
  // }

  if (
    role === "guest" &&
    guestRestrictedPaths.some((word) => location.pathname.includes(word))
  ) {
    return <Navigate to="/dashboard" />;
  }

  if (isLoading)
    return (
      <div>
        <Spinner />
      </div>
    );

  return <>{children}</>;
}
