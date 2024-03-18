import DropdownIcon from "../../assets/icons/arrow_drop_down_24px.svg";
import ExportIcon from "../../assets/icons/Export Icon.svg";
import Contributions from "./Contributions";
import SelectedRateChart from "./SelectedRateChart";
import CommentedArticlesChart from "./CommentedArticlesChart";
import DailyTrafficChart from "./DailyTrafficChart";
import SubmissionTrendsChart from "./SubmissionTrendsChart";
import MainHeader from "../../ui/MainHeader";

export default function Dashboard() {
  return (
    <div>
      <MainHeader>
        <h1 className="ps-6 text-xl font-normal">Dashboard</h1>
      </MainHeader>

      <div className="my-5 flex flex-col gap-5 ps-6">
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded border border-borderColor px-2 py-3 hover:bg-slate-100">
            <span>Timeframe: </span>
            <span className="font-medium">This Month</span>
            <span>
              <img src={DropdownIcon} alt="" />
            </span>
          </button>

          <button className="flex items-center rounded border border-borderColor px-2 py-3 hover:bg-slate-100">
            <img src={ExportIcon} alt="" />
            <span>Export</span>
          </button>
        </div>
        <Contributions />

        <div className="grid grid-cols-3 gap-5">
          <SelectedRateChart />
          <CommentedArticlesChart />
          <DailyTrafficChart />
        </div>

        <div>
          <SubmissionTrendsChart />
        </div>
      </div>
    </div>
  );
}