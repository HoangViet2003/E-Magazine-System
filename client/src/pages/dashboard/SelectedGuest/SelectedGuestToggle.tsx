import DarkSwitch from "../../../assets/switchImg/switch-dark.png";
import LightSwitch from "../../../assets/switchImg/switch-light.png";

interface SelectedGuestToggleProps {
  label: string;
  selectedReports: string[];
  setSelectedReports: (reports: string[]) => void;
  value: string;
}

export default function SelectedGuestToggle({
  selectedReports,
  setSelectedReports,
  value,
  label,
}: SelectedGuestToggleProps) {
  function handleToggle() {
    if (selectedReports.includes(value)) {
      setSelectedReports(selectedReports.filter((item) => item !== value));
    } else {
      setSelectedReports([...selectedReports, value]);
    }
  }

  return (
    <div className="flex items-center gap-6">
      <div
        className="relative flex flex-shrink-0 cursor-pointer items-center overflow-hidden rounded-full"
        onClick={() => {
          handleToggle();
        }}
      >
        <div
          className={`absolute z-10 h-[20px] w-[20px] rounded-full bg-white duration-200 md:h-[33px] md:w-[33px] ${selectedReports.includes(value) ? "left-10 md:left-[59px]" : "left-1"}`}
        ></div>

        <div className="grid w-16 md:w-auto">
          <img src={LightSwitch} className="col-start-1 row-start-1 w-full" />
          <img
            src={DarkSwitch}
            className={`col-start-1 row-start-1 duration-200 ${selectedReports.includes(value) ? "opacity-0" : "opacity-100"}`}
          />
        </div>
      </div>
      <span className="text-md md:text-xl">{label}</span>
    </div>
  );
}
