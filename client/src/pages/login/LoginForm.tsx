import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../redux/hooks/useAuth";
import SpinnerMini from "../../ui/SpinnerMini";
import LoginBackground from "../../assets/natural-4821583_1920.png";

export default function LoginForm() {
  const [email, setEmail] = useState("staff1@gmail.com");
  const [password, setPassword] = useState("staff123");
  const { login, isLoading } = useAuth();
  const isAuth = localStorage.getItem("isAuth");
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !password) return;
    login({ email, password });

    setEmail("");
    setPassword("");
  }

  useEffect(() => {
    if (isAuth === "true") navigate("/dashboard");
  }, [isAuth, navigate]);

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

          <input
            id="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full border-b border-b-white bg-transparent pb-1 text-white outline-none placeholder:text-slate-300"
            disabled={isLoading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-b-white bg-transparent pb-1 text-white outline-none placeholder:text-slate-300"
          />

          <a href="" className="ms-auto text-white">
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
