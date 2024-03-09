import QuestionCircleIcon from "../../assets/icons/question-circle-full.svg";
import CogIcon from "../../assets/icons/cog.svg";

export default function HeaderMenu() {
  return (
    <div className="flex items-center gap-2">
      <button className="w-full p-3">
        <img src={QuestionCircleIcon} alt="question" className="w-full" />
      </button>
      <button className="w-full p-3">
        <img src={CogIcon} alt="cog" className="w-full" />
      </button>
    </div>
  );
}
