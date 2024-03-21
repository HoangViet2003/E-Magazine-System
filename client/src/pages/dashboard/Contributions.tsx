import SaleIcon from "../../assets/icons/summaryItem-icons/Sales Icon.svg";
import CheckIcon from "../../assets/icons/summaryItem-icons/Check_round_fill.svg";
import ContributorsIcon from "../../assets/icons/summaryItem-icons/contributor.svg";
import CommentIcon from "../../assets/icons/summaryItem-icons/comment.svg";

import SummaryItem from "./SummaryItem";

export default function Contributions() {
  return (
    <div className="flex flex-col gap-[30px] border border-borderColor p-5 shadow-md">
      <h2 className="text-xl font-semibold">Contributions summary</h2>

      <div className="flex flex-wrap gap-5">
        <SummaryItem
          icon={SaleIcon}
          iconBg="#0B5FFF"
          background="#C5D9FF"
          data={136}
          type="Articles Submitted"
          changePercentage={8}
        />

        <SummaryItem
          icon={CheckIcon}
          iconBg="#00AC4F"
          background="#DCFCE7"
          data={50}
          type="Articles Selected"
          changePercentage={-8}
        />

        <SummaryItem
          icon={ContributorsIcon}
          iconBg="#000000"
          background="#FCF9DC"
          data={130}
          type="Contributors"
          changePercentage={-8}
        />

        <SummaryItem
          icon={CommentIcon}
          iconBg="#A553FF"
          background="#F3E8FF"
          data={1134}
          type="Comments"
          changePercentage={8}
        />

        <SummaryItem
          icon={SaleIcon}
          iconBg="#FA5A7D"
          background="#DFE9FD"
          data={1000}
          type="Total Sales"
          changePercentage={8}
        />
      </div>
    </div>
  );
}
