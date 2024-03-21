import QuestionCircleIcon from "../../assets/icons/question-circle-full.svg";
import CogIcon from "../../assets/icons/cog.svg";

export default function HeaderMenu() {
  return (
    <div className="hidden items-center gap-2 md:flex">
      <button className="w-full rounded-full p-3 duration-300 hover:bg-slate-200">
        <img src={QuestionCircleIcon} alt="question" className="w-full" />
      </button>
      <button className="w-full rounded-full p-3 duration-300 hover:bg-slate-200">
        <img src={CogIcon} alt="cog" className="w-full" />
      </button>
    </div>
  );
}
