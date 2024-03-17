import { useNavigate, useParams } from "react-router-dom";

import MainHeader from "../../ui/MainHeader";
import MyFacultyTable from "./MyFacultyTable";

import DropdownIcon from "../../assets/icons/caret-bottom.svg";
import BreadcrumbPointer from "../../assets/icons/breadcrumb-pointer.svg";
import { useFolder } from "../../redux/hooks/useFolder";

export default function MyFaculty() {
  const navigate = useNavigate();
  const { yearContributeId } = useParams();
  const { folders } = useFolder();

  const selectedFolder = folders.filter(
    (folders) => folders._id === yearContributeId,
  )[0];

  return (
    <div>
      <MainHeader>
        <span className="flex items-center gap-[10px]">
          <h1
            className="cursor-pointer ps-6 text-xl font-normal"
            onClick={() => navigate("/myFaculty")}
          >
            My Faculty
          </h1>
          <img src={BreadcrumbPointer} />
          <h1 className="text-xl font-normal">{selectedFolder.title}</h1>
          <img src={DropdownIcon} alt="" />
        </span>
      </MainHeader>

      <div className="my-5 flex flex-col gap-5 ps-6">
        <MyFacultyTable yearContribute={selectedFolder.year} />
      </div>
    </div>
  );
}
