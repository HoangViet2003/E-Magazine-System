import { useState, useEffect } from "react";
import { useContribution } from "../../redux/hooks";
// import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { toast } from "react-toastify";

const CreateContribution = () => {
  const [academicYear, setAcademicYear] = useState("");
  const [closureDate, setClosureDate] = useState<Dayjs | null>(null);
  const [finalClosureDate, setFinalClosureDate] = useState<Dayjs | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { createContributionForAllFaculty, updateContribution } =
    useContribution();

  // console.log(finalClosureDate?.getFullYear())
  console.log(error);

  // const navigate = useNavigate();
  const location = useLocation();

  const { state } = location;

  const contribution = state && state.row;
  console.log(contribution);

  useEffect(() => {
    if (contribution) {
      setAcademicYear(contribution.academicYear.toString());
      setClosureDate(dayjs(contribution.closureDate));
      setFinalClosureDate(dayjs(contribution.finalClosureDate));
    }
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

    // Validate inputs
    if (!academicYear || !closureDate || !finalClosureDate) {
      setError("Please fill out all fields.");
      toast.error("Please fill out all fields.");
      return;
    }

    // Get the current date
    const currentDate = dayjs();

    // Validate closure date is larger than today
    if (closureDate.isBefore(currentDate, "day")) {
      setError("Closure date must be later than today.");
      toast.error("Closure date must be later than today.");
      return;
    }

    // Get the current year
    const currentYear = currentDate.year();

    // Validate academic year
    if (parseInt(academicYear) !== currentYear) {
      setError("Academic year must be the current year.");
      toast.error("Academic year must be the current year.");
      return;
    }

    // Validate closure date and final closure date are in the current year
    if (
      !isSameYear(closureDate, currentYear) ||
      !isSameYear(finalClosureDate, currentYear)
    ) {
      setError(
        "Closure date and final closure date must be in the current year.",
      );
      toast.error(
        "Closure date and final closure date must be in the current year.",
      );
      return;
    }

    // Validate final closure date is at least 14 days after closure date
    const daysDifference = finalClosureDate.diff(closureDate, "day");
    if (daysDifference < 14) {
      setError(
        "Final closure date must be at least 14 days after closure date.",
      );
      toast.error(
        "Final closure date must be at least 14 days after closure date.",
      );
      return;
    }

    // All validations passed, create the faculty
    const data = {
      academicYear: parseInt(academicYear),
      closureDate: closureDate.toISOString(),
      finalClosureDate: finalClosureDate.toISOString(),
    };
    if (contribution) {
      updateContribution(data);
      return;
    }
    createContributionForAllFaculty(data);
  };

  const isSameYear = (date: Dayjs | null, year: number): boolean => {
    if (!date) return false;
    return date.year() === year;
  };

  return (
    <div className="">
      <h1 className="mb-6 font-bold"> Create Contribution</h1>
      <div className="flex items-center justify-center">
        <form className="w-full max-w-lg" onSubmit={handleSubmit}>
          <div className="-mx-3 mb-6 flex flex-wrap">
            <div className="mb-6  w-full px-3 md:mb-0">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
                Academic Year
              </label>
              <input
                className="mb-3 block w-full appearance-none rounded border bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:bg-white focus:outline-none"
                value={academicYear}
                type="text"
                placeholder="Academic Year"
                onChange={(e) => setAcademicYear(e.target.value)}
              />
              {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
            </div>
          </div>
          <div className="-mx-3 mb-6 flex flex-wrap">
            <div className="mb-6  w-full px-3 md:mb-0">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
                Closure Date
              </label>
              <DateTimePicker
                value={closureDate}
                onChange={(date: Dayjs | null) => setClosureDate(date)}
              />
              {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
            </div>
          </div>
          <div className="-mx-3 mb-6 flex flex-wrap">
            <div className="mb-6  w-full px-3 md:mb-0">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
                Final CLosure Date
              </label>
              <DateTimePicker
                value={finalClosureDate}
                onChange={(date: Dayjs | null) => setFinalClosureDate(date)}
              />
              {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
            </div>
          </div>

          <button className="btn btn-xs mt-3 sm:btn-md md:btn-md lg:btn-md">
            {contribution ? "Update" : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateContribution;