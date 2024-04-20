import { useEffect, useState } from "react";
import { useFaculty } from "../../../redux/hooks/useFaculty";
import SelectedGuestToggle from "./SelectedGuestToggle";
import Button from "../../../ui/Button";

export default function SelectedGuestModal() {
  const { faculty, getFacultyById, handleSelectedReport } = useFaculty();
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const role = localStorage.getItem("role");

  // Get selectedReports from api
  useEffect(() => {
    const fetchData = () => {
      getFacultyById();
    };

    if (role === "marketing coordinator") fetchData();
  }, []);
  useEffect(() => {
    setSelectedReports(faculty.selectedReports);
  }, [faculty]);

  function handleUpdateSelectedReports() {
    handleSelectedReport(selectedReports);
  }

  return (
    <dialog id="guest_report_selection" className="modal">
      <div className="modal-box max-w-[640px] rounded-md">
        <h3 className="mb-12 text-center text-lg font-bold">
          Select guest reports
        </h3>

        <div className="flex flex-col gap-9">
          <SelectedGuestToggle
            selectedReports={selectedReports}
            setSelectedReports={setSelectedReports}
            value="articlesSubmitted"
            label="Article Submitted"
          />

          <SelectedGuestToggle
            selectedReports={selectedReports}
            setSelectedReports={setSelectedReports}
            value="articlesSelected"
            label="Article Selected"
          />

          <SelectedGuestToggle
            selectedReports={selectedReports}
            setSelectedReports={setSelectedReports}
            value="contributionNo"
            label="Number of Contributors"
          />

          <SelectedGuestToggle
            selectedReports={selectedReports}
            setSelectedReports={setSelectedReports}
            value="commentNo"
            label="Number of commented articles"
          />

          <SelectedGuestToggle
            selectedReports={selectedReports}
            setSelectedReports={setSelectedReports}
            value="uncommentNo"
            label="Number of uncommented articles"
          />
        </div>

        <div className="mt-3 flex justify-end gap-4">
          <form method="dialog">
            <Button type="light" className="px-6">
              Cancel
            </Button>
          </form>

          <form method="dialog">
            <Button onClick={handleUpdateSelectedReports} className="px-6">
              Save
            </Button>
          </form>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
