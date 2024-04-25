import { useEffect, useState } from "react";
import { useArticle, useContribution } from "../../redux/hooks";
import { useFaculty } from "../../redux/hooks/useFaculty";
import { Faculty } from "../../redux/slices/FacultySlice";

import Dropdowns from "../../ui/Dropdowns";
import CheckIcon from "../../assets/icons/check_ring_round_light.svg";
import DropdownIcon from "../../assets/icons/arrow_drop_down_24px.svg";

import SelectedGuestModal from "./SelectedGuest/SelectedGuestModal";
import useWindowWidth from "../../redux/hooks/useWindowWidth";

export default function DashboardOperation() {
  const [academicYear, setAcademicYear] = useState(new Date().getFullYear());
  const [department, setDepartment] = useState("IT Department");
  const { handleSetDashBoard } = useArticle();
  const { getFaculties, faculties } = useFaculty();
  const { fetchAllContributionByManager, contributions } = useContribution();
  const role = localStorage.getItem("role");
  const windowWidth = useWindowWidth();

  function handleChangeAcademicYear(year?: number) {
    if (year) {
      if (academicYear != year) {
        setAcademicYear(year);
        handleSetDashBoard(year);
      }
    }
  }

  function handleChangeFaculty(faculty: Faculty) {
    if (faculty.name != department) {
      setDepartment(faculty.name);
      handleSetDashBoard(academicYear, faculty._id);
    }
  }

  useEffect(() => {
    if (role === "marketing manager" || role === "marketing coordinator")
      getFaculties();
    fetchAllContributionByManager(1);
  }, []);

  return (
    <div className="flex justify-between">
      <div className="flex gap-3">
        <Dropdowns>
          <Dropdowns.Dropdown>
            <Dropdowns.Toggle id="dashboard_year">
              <span className="flex items-center gap-2 rounded border border-borderColor px-2 py-3 hover:bg-slate-100">
                <span className="text-xs md:text-base">
                  Academic Year{windowWidth > 576 && ":"}
                </span>
                {windowWidth > 576 && (
                  <span className="font-medium">{academicYear}</span>
                )}

                <span>
                  <img src={DropdownIcon} />
                </span>
              </span>
            </Dropdowns.Toggle>

            <Dropdowns.List id="dashboard_year">
              {contributions.map((contribution) => (
                <span key={contribution._id}>
                  <Dropdowns.Button
                    onClick={() =>
                      handleChangeAcademicYear(contribution.academicYear)
                    }
                    key={contribution._id}
                  >
                    <span className="font-bold">
                      {contribution.academicYear}
                    </span>
                  </Dropdowns.Button>
                </span>
              ))}
            </Dropdowns.List>
          </Dropdowns.Dropdown>
        </Dropdowns>

        {role === "marketing manager" && (
          <Dropdowns>
            <Dropdowns.Dropdown>
              <Dropdowns.Toggle id="department">
                <span className="flex items-center gap-2 rounded border border-borderColor px-2 py-3 hover:bg-slate-100">
                  <span>Faculty: </span>
                  <span className="font-medium">{department}</span>
                  <img src={DropdownIcon} alt="" />
                </span>
              </Dropdowns.Toggle>

              <Dropdowns.List id="department">
                {faculties.map((faculty) => (
                  <Dropdowns.Button
                    onClick={() => handleChangeFaculty(faculty)}
                    key={faculty._id}
                  >
                    <span className="font-bold">{faculty.name}</span>
                  </Dropdowns.Button>
                ))}
              </Dropdowns.List>
            </Dropdowns.Dropdown>
          </Dropdowns>
        )}
      </div>

      {role === "marketing coordinator" && (
        <button
          className="flex items-center gap-2 rounded border border-borderColor px-2 py-3  hover:bg-slate-100"
          onClick={() => {
            const modal = document.getElementById(
              "guest_report_selection",
            ) as HTMLDialogElement | null;
            if (modal) {
              modal.showModal();
            } else {
              console.error("Modal not found");
            }
          }}
        >
          {windowWidth > 576 && <img src={CheckIcon} />}
          <span className="text-xs md:text-base">Select guest report</span>
        </button>
      )}

      <SelectedGuestModal />
    </div>
  );
}
