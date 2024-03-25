import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../redux/hooks/useAuth";
import Spinner from "./Spinner";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { isAuth, isLoading, setUserFromToken } = useAuth();
  const userToken = localStorage.getItem("user");

  useEffect(() => {
    if (userToken) {
      setUserFromToken(userToken);
    } else {
      navigate("/login");
    }
  }, []);

  if (isLoading)
    return (
      <div>
        <Spinner />
      </div>
    );

  if (isAuth) return children;

  return null;
}
