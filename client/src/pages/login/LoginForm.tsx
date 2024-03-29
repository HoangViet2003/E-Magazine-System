import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../redux/hooks/useAuth";
import SpinnerMini from "../../ui/SpinnerMini";
import LoginBackground from "../../assets/natural-4821583_1920.png";

export default function LoginForm() {
  const [email, setEmail] = useState("student2@gmail.com");
  const [password, setPassword] = useState("student123");
  const [emailError, setEmailError] = useState("");
  const { login, isLoading, setUserFromToken } = useAuth();
  const userToken = localStorage.getItem("user");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !password) return;
    login({ email, password });

    setEmail("");
    setPassword("");
  }

  function handleForgotPassword() {
    if (email === "") {
      setEmailError("This field is required");
    }
  }

  useEffect(() => {
    if (userToken) {
      setUserFromToken(userToken);
      if (role === "marketing coordinator") navigate("/dashboard");
      if (role === "student") navigate("/student");
    }
  }, [navigate, role, userToken]);

  return (
    <div
      className="grid h-screen w-screen grid-rows-[auto_1fr]"
      style={{ backgroundImage: `url(${LoginBackground})` }}
    >
      <a href="/" className="mx-6 my-4 text-2xl font-semibold text-white">
        E-Magazine System
      </a>

      <form
        className="flex items-center justify-center"
        onSubmit={handleSubmit}
      >
        <div className="container mx-4 flex max-w-96 flex-col items-center gap-6 rounded-3xl border border-white p-6 backdrop-blur-md ">
          <h2 className="my-4 text-2xl font-semibold text-white">Login</h2>

          <div className="w-full">
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-b-white bg-transparent pb-1 text-white outline-none placeholder:text-slate-300"
              disabled={isLoading}
            />

            {emailError && (
              <span className="text-sm text-red-500">{emailError}</span>
            )}
          </div>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-b-white bg-transparent pb-1 text-white outline-none placeholder:text-slate-300"
          />

          <a
            onClick={handleForgotPassword}
            className="ms-auto cursor-pointer text-white"
          >
            Forgot your password?
          </a>

          <button
            className="mb-6 w-full rounded bg-white p-2 font-semibold duration-300 hover:bg-slate-200 disabled:bg-slate-200"
            disabled={isLoading}
          >
            {!isLoading ? "Login" : <SpinnerMini />}
          </button>
        </div>
      </form>
    </div>
  );
}
