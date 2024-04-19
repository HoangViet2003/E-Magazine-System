import { useEffect, useState } from "react";
import { useArticle } from "../../redux/hooks";
import Dropdowns from "../../ui/Dropdowns";
import CheckIcon from "../../assets/icons/check_ring_round_light.svg";
import DropdownIcon from "../../assets/icons/arrow_drop_down_24px.svg";

import SelectedGuestModal from "./SelectedGuest/SelectedGuestModal";
import { useFaculty } from "../../redux/hooks/useFaculty";

export default function DashboardOperation() {
  const [academicYear, setAcademicYear] = useState(2024);
  const [department, setDepartment] = useState("IT Department");
  const { handleSetDashBoard } = useArticle();
  const { getFaculties, faculties } = useFaculty();
  const role = localStorage.getItem("role");

  function handleChangeAcademicYear(year: number) {
    if (academicYear !== year) {
      setAcademicYear(year);
      handleSetDashBoard(year);
    }
  }

  useEffect(() => {
    if (role === "marketing manager") getFaculties();
  }, []);

  console.log(faculties);

  return (
    <div className="flex justify-between">
      <div className="flex gap-3">
        <Dropdowns>
          <Dropdowns.Dropdown>
            <Dropdowns.Toggle id="dashboard_year">
              <span className="flex items-center gap-2 rounded border border-borderColor px-2 py-3 hover:bg-slate-100">
                <span>Academic Year: </span>
                <span className="font-medium">{academicYear}</span>
                <span>
                  <img src={DropdownIcon} />
                </span>
              </span>
            </Dropdowns.Toggle>

            <Dropdowns.List id="dashboard_year">
              <Dropdowns.Button onClick={() => handleChangeAcademicYear(2024)}>
                <span className="font-bold">2024</span>
              </Dropdowns.Button>
              <Dropdowns.Button onClick={() => handleChangeAcademicYear(2023)}>
                <span className="font-bold">2023</span>
              </Dropdowns.Button>
            </Dropdowns.List>
          </Dropdowns.Dropdown>
        </Dropdowns>

        {/* {role === "marketing manager" && ( */}
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
              <Dropdowns.Button>
                <span className="font-bold">Profile</span>
              </Dropdowns.Button>
              <Dropdowns.Button>
                <span className="font-bold">Sign out</span>
              </Dropdowns.Button>
            </Dropdowns.List>
          </Dropdowns.Dropdown>
        </Dropdowns>
        {/* )} */}
      </div>

      {role === "marketing coordinator" && (
        <button
          className="flex items-center gap-2 rounded border border-borderColor px-2 py-3 hover:bg-slate-100"
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
          <img src={CheckIcon} alt="" />
          <span>Select guest report</span>
        </button>
      )}

      {/* Guest report modal */}
      <SelectedGuestModal />
    </div>
  );
}
