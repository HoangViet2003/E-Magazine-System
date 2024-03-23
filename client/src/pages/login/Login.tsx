import LoginBackground from "../../assets/natural-4821583_1920.png";

export default function Login() {
  return (
    <div
      className="flex h-screen w-screen items-center justify-center "
      style={{ backgroundImage: `url(${LoginBackground})` }}
    >
      <div className="flex w-96 flex-col items-center gap-6 rounded-3xl border border-white p-6 backdrop-blur-md mx-4">
        <h2 className="my-4 text-2xl font-semibold text-white">Login</h2>

        <input
          type="text"
          className="mb-4 w-full border-b border-b-white bg-transparent pb-1 text-white outline-none"
        />

        <input
          type="password"
          className="w-full border-b border-b-white bg-transparent pb-1 text-white outline-none"
        />

        <a href="" className="ms-auto text-white">
          Forgot your password?
        </a>

        <button className="mb-6 w-full rounded bg-white p-2 font-semibold duration-300 hover:bg-slate-200">
          Login
        </button>
      </div>
    </div>
  );
}
