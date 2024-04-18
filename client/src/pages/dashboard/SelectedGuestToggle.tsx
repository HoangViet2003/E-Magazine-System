import DarkSwitch from "../../assets/switchImg/switch-dark.png";
import LightSwitch from "../../assets/switchImg/switch-light.png";

interface SelectedGuestToggleProps {
  toggleField: boolean;
  setToggleField: (value: boolean) => void;
  label: string;
}

export default function SelectedGuestToggle({
  toggleField,
  setToggleField,
  label,
}: SelectedGuestToggleProps) {
  return (
    <div className="flex items-center gap-6">
      <div
        className="relative flex cursor-pointer items-center overflow-hidden rounded-full"
        onClick={() => setToggleField(!toggleField)}
      >
        <div
          className={`absolute z-10 h-[33px] w-[33px] rounded-full bg-white duration-200 ${toggleField ? "left-[59px]" : "left-1"}`}
        ></div>

        <div className="grid">
          <img src={LightSwitch} className="col-start-1 row-start-1" />
          <img
            src={DarkSwitch}
            className={`col-start-1 row-start-1  duration-200 ${toggleField ? "opacity-0" : "opacity-100"}`}
          />
        </div>
      </div>
      <span className="text-xl">{label}</span>
    </div>
  );
}
