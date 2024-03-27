import { useArticle } from "../../redux/hooks/useArticle";
import { useEffect } from "react";

import MainHeader from "../../ui/MainHeader";
import Dropdowns from "../../ui/Dropdowns";
import MyFacultyTable from "./MyFacultyTable";
import MyFacultyContribution from "./MyFacultyContribution";

import DropdownIcon from "../../assets/icons/caret-bottom.svg";

export default function MyFaculty() {
  const { fetchAllArticle } = useArticle();

  useEffect(() => {
    fetchAllArticle();
  }, []);

  return (
    <div>
      <MainHeader>
        <Dropdowns>
          <Dropdowns.Dropdown>
            <Dropdowns.Toggle id="faculty">
              <span className="flex items-center gap-3 rounded-3xl py-1 hover:bg-slate-100 xl:px-6">
                <h1 className="text-xl font-normal">My Faculty</h1>
                <img src={DropdownIcon} alt="" />
              </span>
            </Dropdowns.Toggle>

            <Dropdowns.List id="faculty">
              <Dropdowns.Button icon={DropdownIcon}>Download</Dropdowns.Button>
              <Dropdowns.Button icon={DropdownIcon}>Delete</Dropdowns.Button>
            </Dropdowns.List>
          </Dropdowns.Dropdown>
        </Dropdowns>
      </MainHeader>

      <div className="my-5 flex flex-col gap-5 xl:ps-6">
        <MyFacultyContribution />

        <MyFacultyTable />
      </div>
    </div>
  );
}