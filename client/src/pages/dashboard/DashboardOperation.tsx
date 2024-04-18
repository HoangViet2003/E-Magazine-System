import Dropdowns from "../../ui/Dropdowns";
import DropdownIcon from "../../assets/icons/arrow_drop_down_24px.svg";
import { useState } from "react";
import { useArticle } from "../../redux/hooks";
import CheckIcon from "../../assets/icons/check_ring_round_light.svg";

import SelectedGuestToggle from "./SelectedGuestToggle";
import Button from "../../ui/Button";

export default function DashboardOperation() {
  const [academicYear, setAcademicYear] = useState(2024);
  const [department, setDepartment] = useState("IT Department");
  const { handleSetDashBoard } = useArticle();

  const [articleSubmittedToggle, setArticleSubmittedToggle] = useState(false);
  const [articleSelectedToggle, setArticleSelectedToggle] = useState(true);
  const [contributionNoToggle, setContributionNoToggle] = useState(true);
  const [commentNoToggle, setCommentNoToggle] = useState(false);
  const [uncommentNoToggle, setUncommentNoToggle] = useState(false);

  function handleChangeAcademicYear(year: number) {
    if (academicYear !== year) {
      setAcademicYear(year);
      handleSetDashBoard(year);
    }
  }

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
                  <img src={DropdownIcon} alt="" />
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
      </div>

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

      {/* Guest report modal */}
      <dialog id="guest_report_selection" className="modal">
        <div className="modal-box max-w-[640px] rounded-md">
          <h3 className="mb-12 text-center text-lg font-bold">
            Select guest reports
          </h3>

          <div className="flex flex-col gap-9">
            <SelectedGuestToggle
              toggleField={articleSubmittedToggle}
              setToggleField={setArticleSubmittedToggle}
              label="Article Submitted"
            />

            <SelectedGuestToggle
              toggleField={articleSelectedToggle}
              setToggleField={setArticleSelectedToggle}
              label="Article Selected"
            />

            <SelectedGuestToggle
              toggleField={contributionNoToggle}
              setToggleField={setContributionNoToggle}
              label="Number of Contributors"
            />

            <SelectedGuestToggle
              toggleField={commentNoToggle}
              setToggleField={setCommentNoToggle}
              label="Number of commented articles"
            />

            <SelectedGuestToggle
              toggleField={uncommentNoToggle}
              setToggleField={setUncommentNoToggle}
              label="Number of uncommented articles"
            />
          </div>

          <div className="mt-3 flex justify-end">
            <Button type="light">Cancel</Button>
            <Button>Save</Button>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
