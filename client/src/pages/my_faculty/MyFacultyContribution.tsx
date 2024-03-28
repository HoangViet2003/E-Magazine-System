import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { useContribution } from "../../redux/hooks/useContribution";

import FolderIcon from "../../assets/icons/folder.svg";
import Spinner from "../../ui/Spinner";
import { useSubmission } from "../../redux/hooks/useSubmission";
import { Submission } from "../../redux/slices/SubmissionSlice";

const ellipsis = "overflow-hidden text-ellipsis whitespace-nowrap";

export default function MyFacultyContribution() {
  const navigate = useNavigate();
  const { contributions, fetchAllContribution, isLoading } = useContribution();
  const { getSubmissionByStudent } = useSubmission();
  const role = localStorage.getItem("role");
  const [submission, setSubmission] = useState<Submission>();

  function calculateClosureDate(date: Date) {
    const today = new Date();

    // Calculate the difference in milliseconds between the given date and today
    const differenceInMilliseconds = date.getTime() - today.getTime();
    const differenceInDays = Math.round(
      differenceInMilliseconds / (1000 * 3600 * 24),
    );

    return differenceInDays;
  }

  useEffect(() => {
    fetchAllContribution();
  }, []);

  useEffect(() => {
    const fetchSubmission = async () => {
      if (role === "student") {
        const submissionData = await getSubmissionByStudent();
        setSubmission(submissionData);
      }
    };

    fetchSubmission();
  }, [getSubmissionByStudent, role]);

  return (
    <div className="flex flex-col gap-4" style={{ color: "#272833" }}>
      <h3 className="font-semibold" style={{ color: "#6B6C7E" }}>
        Contributions
      </h3>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {contributions.map((contribution, index) => (
            <button
              key={index}
              className="rounded border border-borderColor p-4 hover:bg-slate-100"
              onDoubleClick={() =>
                role === "student"
                  ? navigate(`submission/${submission?._id}`)
                  : navigate(`contributions/${contribution._id}`)
              }
            >
              <div className={"flex items-center gap-4"}>
                <img src={FolderIcon} />

                <span className={ellipsis + " font-semibold leading-tight"}>
                  {contribution.academicYear + " Contributions"}

                  {contribution.status === "open" && (
                    <div
                      className={
                        ellipsis + " text-left text-[10px] font-normal"
                      }
                      style={{ color: "#CA3636" }}
                    >
                      {calculateClosureDate(
                        new Date(contribution.closureDate),
                      ) < 0
                        ? "Closed"
                        : `${calculateClosureDate(new Date(contribution.closureDate))} days until closure date`}
                    </div>
                  )}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
