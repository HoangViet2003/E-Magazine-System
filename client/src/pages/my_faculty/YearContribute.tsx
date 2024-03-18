import { useNavigate, useParams } from "react-router-dom";

import MainHeader from "../../ui/MainHeader";
import MyFacultyTable from "./MyFacultyTable";

import DropdownIcon from "../../assets/icons/caret-bottom.svg";
import BreadcrumbPointer from "../../assets/icons/breadcrumb-pointer.svg";
import { useFolder } from "../../redux/hooks/useFolder";
import Dropdowns from "../../ui/Dropdowns";

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
        <div className="ms-6 flex items-center gap-2">
          <h1
            className="cursor-pointer rounded-3xl px-4 py-1 ps-6 text-xl font-normal hover:bg-slate-100"
            onClick={() => navigate("/myFaculty")}
          >
            My Faculty
          </h1>
          <img src={BreadcrumbPointer} />

          <Dropdowns>
            <Dropdowns.Dropdown>
              <Dropdowns.Toggle id="faculty">
                <span className="flex items-center gap-3 rounded-3xl px-4 py-1 hover:bg-slate-100">
                  <h1 className="text-xl font-normal">
                    {selectedFolder.title}
                  </h1>
                  <img src={DropdownIcon} alt="" />
                </span>
              </Dropdowns.Toggle>

              <Dropdowns.List id="faculty">
                <Dropdowns.Button>Download</Dropdowns.Button>
                <Dropdowns.Button>Delete</Dropdowns.Button>
              </Dropdowns.List>
            </Dropdowns.Dropdown>
          </Dropdowns>
        </div>
      </MainHeader>

      <div className="my-5 flex flex-col gap-5 ps-6">
        <MyFacultyTable yearContribute={selectedFolder.year} />
      </div>
    </div>
  );
}
