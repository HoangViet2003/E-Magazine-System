
import { useState, useEffect } from "react";
import { useFaculty } from "../../redux/hooks/useFaculty";
import { useAuth } from "../../redux/hooks";
import { useLocation } from "react-router-dom";

const CreateAccount = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [faculty, setFaculty] = useState("");
  const [isShowFaculty, setIsShowFaculty] = useState(true);
  const { faculties, getFaculties, createAccount } = useFaculty();
  const { updateUser } = useAuth();
  const location = useLocation();

  const { state } = location;

  const user = state && state.row;

  useEffect(() => {
    getFaculties();
    
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setRole(user.role);

      const matchFaculty = faculties.find(
        (faculty) => faculty._id === user.facultyId,
      );
      if (matchFaculty) {
        setFaculty(matchFaculty._id);
      }

    }
  }, [user]);


  useEffect(() => {
    if (role === "marketing manager") {
      setIsShowFaculty(false);
    } else {
      setIsShowFaculty(true);
    }
  }, [role]);

  const handleSubmit = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const data = {
      name: name,
      email: email,
      password: password,
      role: role,
      facultyId: faculty,
    };
    if (user) {
      updateUser(user._id, data);
      return;
    }

    createAccount(data);
  };

  const handleSetFacultyId = (e: any) => {
    setFaculty(e.target.value);
    console.log("facultyId", e);
  };

  return (
    <div className="">
      <h1 className="mb-6 font-bold">Create Account</h1>
      <div className="flex items-center justify-center">
        <form className="w-full max-w-lg" onSubmit={() => handleSubmit}>
          <div className="-mx-3 mb-6 flex flex-wrap">
            <div className="mb-6 w-full px-3 md:mb-0 md:w-1/2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
                Name
              </label>
              <input
                value={name}
                className="mb-3 block w-full appearance-none rounded border border-red-500 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:bg-white focus:outline-none"
                type="text"
                placeholder="Jane"
                onChange={(e) => setName(e.target.value)}
              />
              {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
            </div>
            <div className="w-full px-3 md:w-1/2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
                Email
              </label>
              <input
                value={email}
                className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                type="email"
                placeholder="@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="-mx-3 mb-6 flex flex-wrap">
            <div className="w-full px-3">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
                Password
              </label>
              <input
                value={password}
                className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                id="grid-password"
                type="password"
                placeholder="******************"
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs italic text-gray-600">
                Make it as long and as crazy as you'd like
              </p>
            </div>
          </div>
          <div className="-mx-3 mb-2 flex flex-wrap">
            <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
                Role
              </label>
              <div className="relative">
                <select
                  value={role}
                  className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                  id="grid-state"
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="marketing coordinator">
                    Marketing Coordinator
                  </option>
                  <option value="marketing manager">Marketing Manager</option>
                  <option value="guest">Guest</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="h-4 w-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>

            </div>

            {isShowFaculty && (
              <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
                  Faculty
                </label>
                <div className="relative">
                  <select
                    value={faculty}
                    className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                    id="grid-state"
                    onChange={handleSetFacultyId}
                  >
                    {faculties.map((faculty) => (
                      <option key={faculty._id} value={faculty._id}>
                        {faculty.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="h-4 w-4 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button className="btn btn-xs mt-6 sm:btn-md md:btn-md lg:btn-md">
            {user ? "Update" : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
