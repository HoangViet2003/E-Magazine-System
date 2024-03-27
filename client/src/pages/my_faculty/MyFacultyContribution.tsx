import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { useContribution } from "../../redux/hooks/useContribution";

import FolderIcon from "../../assets/icons/folder.svg";
import Spinner from "../../ui/Spinner";

const ellipsis = "overflow-hidden text-ellipsis whitespace-nowrap";

export default function MyFacultyContribution() {
  const navigate = useNavigate();
  const { contributions, fetchAllContribution, isLoading } = useContribution();

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

  return (
    <div className="flex flex-col gap-4" style={{ color: "#272833" }}>
      <h3 className="font-semibold" style={{ color: "#6B6C7E" }}>
        Contributions
      </h3>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="2 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {contributions.map((contribution, index) => (
            <button
              key={index}
              className="rounded border border-borderColor p-4 hover:bg-slate-100"
              onDoubleClick={() =>
                navigate(`contributions/${contribution._id}`)
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