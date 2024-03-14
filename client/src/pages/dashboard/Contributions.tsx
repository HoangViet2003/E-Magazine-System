import SaleIcon from "../../assets/icons/summaryItem-icons/Sales Icon.svg";
import CheckIcon from "../../assets/icons/summaryItem-icons/Check_round_fill.svg";
import ContributorsIcon from "../../assets/icons/summaryItem-icons/contributor.svg";
import CommentIcon from "../../assets/icons/summaryItem-icons/comment.svg";

import SummaryItem from "./SummaryItem";

export default function Contributions() {
  return (
    <div className="flex flex-col gap-[30px] border border-borderColor p-5 shadow-md">
      <h2 className="text-xl font-semibold">Contributions summary</h2>

      <div className="flex gap-5">
        <SummaryItem
          icon={SaleIcon}
          iconBg="#0B5FFF"
          background="#C5D9FF"
          data={136}
          type="Articles Submitted"
          changes="+8% from last month"
        />

        <SummaryItem
          icon={CheckIcon}
          iconBg="#00AC4F"
          background="#DCFCE7"
          data={50}
          type="Articles Selected"
          changes="-8% from last month"
        />

        <SummaryItem
          icon={ContributorsIcon}
          iconBg="#000000"
          background="#FCF9DC"
          data={130}
          type="Contributors"
          changes="+8% from yesterday"
        />

        <SummaryItem
          icon={CommentIcon}
          iconBg="#A553FF"
          background="#F3E8FF"
          data={1134}
          type="Comments"
          changes="+8% from yesterday"
        />

        <SummaryItem
          icon={SaleIcon}
          iconBg="#FA5A7D"
          background="#DFE9FD"
          data={136}
          type="Total Sales"
          changes="+8% from month"
        />
      </div>
    </div>
  );
}
