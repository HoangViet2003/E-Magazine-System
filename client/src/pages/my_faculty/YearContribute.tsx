import { useNavigate, useParams } from "react-router-dom";
import { useFolder } from "../../redux/hooks/useFolder";

import MainHeader from "../../ui/MainHeader";
import MyFacultyTable from "./MyFacultyTable";
import Dropdowns from "../../ui/Dropdowns";

import DropdownIcon from "../../assets/icons/caret-bottom.svg";
import BreadcrumbPointer from "../../assets/icons/breadcrumb-pointer.svg";

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
        <div className="flex items-center">
          <h1
            className="cursor-pointer whitespace-nowrap rounded-3xl py-1 pe-6 text-xl font-normal hover:bg-slate-100 xl:ps-6"
            onClick={() => navigate("/myFaculty")}
          >
            My Faculty
          </h1>
          <img src={BreadcrumbPointer} />

          <Dropdowns>
            <Dropdowns.Dropdown>
              <Dropdowns.Toggle id={selectedFolder._id}>
                <span className="flex w-44 items-center gap-3 rounded-3xl px-6 py-1 hover:bg-slate-100 md:w-auto">
                  <h1 className="overflow-hidden text-ellipsis whitespace-nowrap text-xl font-normal ">
                    {selectedFolder.title}
                  </h1>
                  <img src={DropdownIcon} alt="" />
                </span>
              </Dropdowns.Toggle>

              <Dropdowns.List id={selectedFolder._id}>
                <Dropdowns.Button icon={DropdownIcon}>
                  Download
                </Dropdowns.Button>
                <Dropdowns.Button icon={DropdownIcon}>Delete</Dropdowns.Button>
              </Dropdowns.List>
            </Dropdowns.Dropdown>
          </Dropdowns>
        </div>
      </MainHeader>

      <div className="my-5 flex flex-col gap-5 xl:ps-6">
        <MyFacultyTable yearContribute={selectedFolder.year} />
      </div>
    </div>
  );
}
