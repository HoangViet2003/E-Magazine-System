import { useState, useEffect } from "react";
import { useFaculty } from "../../../redux/hooks/useFaculty";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const CreateFaculty = () => {
  const [name, setName] = useState("");
  const { createFaculty, updateFaculty } = useFaculty();
  const navigate = useNavigate();
  const location = useLocation();

  const { state } = location;

  const faculty = state && state.faculty;
  console.log(faculty);

  useEffect(() => {
    if (faculty) {
      setName(faculty.name || "");
    }
  }, [faculty]);

  const handleSubmit = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const data = {
      name: name,
    };
    if (faculty) {
      updateFaculty(faculty._id, data);
      // navigate('/faculty')
      return;
    }
    createFaculty(data);
    // navigate('/faculty')
  };

  return (
    <div className="">
      <h1 className="mb-6 font-bold">
        {faculty ? "Update" : "Create"} Faculty
      </h1>
      <div className="flex items-center justify-center">
        <form className="w-full max-w-lg" onSubmit={handleSubmit}>
          <div className="-mx-3 mb-6 flex flex-wrap">
            <div className="mb-6  w-full px-3 md:mb-0">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
                Faculty Name
              </label>
              <input
                className="mb-3 block w-full appearance-none rounded border border-red-500 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:bg-white focus:outline-none"
                value={name}
                type="text"
                placeholder="Jane"
                onChange={(e) => setName(e.target.value)}
              />
              {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
            </div>
          </div>

          <button className="btn btn-xs mt-3 sm:btn-md md:btn-md lg:btn-md">
            {faculty ? "Update" : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateFaculty;
