import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../index";
import { setLoadingUser, setUser } from "../slices/UserSlice";

export function useAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuth, isLoading, user } = useSelector(
    (state: RootState) => state.user,
  );

  const url = "https://e-magazine.onrender.com/api/v1/";

  const setUserFromToken = async (userToken?: string) => {
    dispatch(setLoadingUser(true));

    if (userToken) {
      const { _id, name, email, role, createdAt, updatedAt } =
        JSON.parse(userToken);

      dispatch(setUser({ _id, name, email, role, createdAt, updatedAt }));
    }
    dispatch(setLoadingUser(false));
  };

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    dispatch(setLoadingUser(true));

    try {
      const { data } = await axios({
        method: "post",
        url: `${url}/login`,
        data: {
          email,
          password,
        },
      });

      if (data.status === "success") {
        dispatch(setUser(data.user));

        localStorage.setItem("token", data.token.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", data.user.role);

        alert("Login successfully");

        navigate("/dashboard", { replace: true });
      } else {
        alert("Provided email or password are incorrect");
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoadingUser(false));
    }
  };

  const logout = async () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return {
    user,
    isLoading,
    isAuth,
    login,
    logout,
    setUserFromToken,
  };
}
