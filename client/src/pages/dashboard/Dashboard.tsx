import ContributionSummary from "./ContributionSummary";
import SelectedRateChart from "./SelectedRateChart";
import CommentedArticlesChart from "./CommentedArticlesChart";
import DailyTrafficChart from "./DailyTrafficChart";
import SubmissionTrendsChart from "./SubmissionTrendsChart";
import MainHeader from "../../ui/MainHeader";
import { useEffect } from "react";
import { useArticle } from "../../redux/hooks";
import DashboardOperation from "./DashboardOperation";
import Spinner from "../../ui/Spinner";

export default function Dashboard() {
  const { isLoading, handleSetDashBoard } = useArticle();

  useEffect(() => {
    handleSetDashBoard();
  }, []);

  return (
    <div>
      <MainHeader>
        <h1 className="text-xl font-normal xl:ps-6">Dashboard</h1>
      </MainHeader>

      <div className="my-5 flex flex-col gap-5 xl:ps-6">
        <DashboardOperation />

        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <ContributionSummary />

            <div className="grid gap-5 lg:grid-cols-2 3xl:grid-cols-3">
              <SelectedRateChart />
              <CommentedArticlesChart />
              <DailyTrafficChart />
            </div>

            <div>
              <SubmissionTrendsChart />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
