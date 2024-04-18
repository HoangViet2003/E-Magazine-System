import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../redux/hooks/useAuth";
import SpinnerMini from "../../ui/SpinnerMini";
import LoginBackground from "../../assets/natural-4821583_1920.png";
import { useParams } from "react-router-dom";

const ForgetPassword = () => {
    const [password, setPassword] = useState("student123");

    const {  isLoading,handleResetPassword } = useAuth();
    const { token } = useParams();

    const navigate = useNavigate();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
            e.preventDefault();
            if (!password) return;
            // login({ email, password });
            handleResetPassword(password, token ?? ""); // Add nullish coalescing operator to provide a default value for token
         
            setPassword("");
    }

    function handleForgotPassword() {
        navigate("/login")
    }


  return (
      <div
          className="object-fit grid h-screen w-screen grid-rows-[auto_1fr] bg-cover bg-no-repeat"
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
                  <h2 className="my-4 text-2xl font-semibold text-white">Reset password</h2>


                  <input
                      type="password"
                      placeholder="Enter New Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border-b border-b-white bg-transparent pb-1 text-white outline-none placeholder:text-slate-300"
                  />

                  <a
                      onClick={handleForgotPassword}
                      className="ms-auto cursor-pointer text-white"
                  >
                      Login
                  </a>

                  <button
                      className="mb-6 w-full rounded bg-white p-2 font-semibold duration-300 hover:bg-slate-200 disabled:bg-slate-200"
                      disabled={isLoading}
                  >
                      {!isLoading ? "Reset password" : <SpinnerMini />}
                  </button>
              </div>
          </form>
      </div>
  )
}

export default ForgetPassword