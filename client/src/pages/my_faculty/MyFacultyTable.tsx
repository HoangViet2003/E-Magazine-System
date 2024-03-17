import { useSearchParams } from "react-router-dom";
import Table from "../../ui/Table";

import FacultyRow from "./FacultyRow";
import MyFacultyOperation from "./MyFacultyOperation";

// import ProfileImg from "../../assets/profile1.png";
import { URL } from "../../utils/constant";
import { useContribution } from "../../redux/hooks/useContribution";

export default function MyFacultyTable({
  yearContribute,
}: {
  yearContribute?: number;
}) {
  const [searchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "updatedAt-desc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const { contributions } = useContribution();

  // FILTER
  let filteredContributions = contributions;

  if (yearContribute) {
    filteredContributions = contributions.filter(
      (contribution) =>
        new Date(contribution.createdAt).getFullYear() === yearContribute,
    );
  }

  function openNewTab(id: string) {
    window.open(`${URL}/documents/${id}`, "_blank");
  }

  // SORT
  const sortedData = filteredContributions.slice().sort((a, b) => {
    if ((a as any)[field] < (b as any)[field]) return -1 * modifier;
    if ((a as any)[field] > (b as any)[field]) return 1 * modifier;
    return 0;
  });

  return (
    <Table columns="0.3fr 2.4fr 1.5fr 1fr 1fr">
      <Table.Header>
        <MyFacultyOperation />
      </Table.Header>

      <Table.Body
        data={sortedData}
        render={(data) => (
          <div onDoubleClick={() => openNewTab(data._id)}>
            <FacultyRow data={data} key={data._id} />
          </div>
        )}
      />
    </Table>
  );
}
