import { useSearchParams } from "react-router-dom";
import Table from "../../ui/Table";

import FacultyRow from "./FacultyRow";
import MyFacultyOperation from "./MyFacultyOperation";

import ProfileImg from "../../assets/profile1.png";
import { URL } from "../../utils/constant";

const fakeData = [
  {
    _id: "1",
    name: "Behind The Curtain _ Theatre Production Backstage...",
    profile: ProfileImg,
    action: "Selected for contribute",
    owner: "Tuan Anh",
    updatedAt: "2024-03-05T00:41:05.610635+00:00",
    createdAt: "2024-03-05T00:41:05.610635+00:00",
  },
  {
    _id: "2",
    name: "Shining Star _ Jane Doe Student Profile.docx",
    profile: ProfileImg,
    action: "Selected for contribute",
    owner: "Tuan Anh",
    updatedAt: "2024-02-05T00:41:05.610635+00:00",
    createdAt: "2024-02-05T00:41:05.610635+00:00",
  },
  {
    _id: "3",
    name: "Tech Wave 2024 _ Trends Reshaping Student.docx",
    profile: ProfileImg,
    action: "Selected for contribute",
    owner: "Nguyen Thi Thu Ha",
    updatedAt: "2024-04-05T00:41:05.610635+00:00",
    createdAt: "2024-04-05T00:41:05.610635+00:00",
  },
  {
    _id: "4",
    name: "Around The World Plates _ Culinary Adventures Exch...",
    profile: ProfileImg,
    action: "Selected for contribute",
    owner: "Tuan Anh",
    updatedAt: "2024-09-05T00:41:05.610635+00:00",
    createdAt: "2024-09-05T00:41:05.610635+00:00",
  },
  {
    _id: "5",
    name: "Ink And Imagination _ Creative Writing Workshop Reference",
    profile: ProfileImg,
    action: "Selected for contribute",
    owner: "Tuan Anh",
    updatedAt: "2024-11-05T00:41:05.610635+00:00",
    createdAt: "2024-11-05T00:41:05.610635+00:00",
  },
];

export default function MyFacultyTable({
  yearContribute,
}: {
  yearContribute?: string;
}) {
  const [searchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "updatedAt-desc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  // FILTER
  let filteredContributions = fakeData;

  if (yearContribute) {
    filteredContributions = fakeData.filter(
      (contribution) =>
        new Date(contribution.createdAt).getFullYear() ===
        parseInt(yearContribute),
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
