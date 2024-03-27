import MainHeader from "../../ui/MainHeader";
import Dropdowns from "../../ui/Dropdowns";

import DropdownIcon from "../../assets/icons/caret-bottom.svg";
import MyFacultyContribution from "../my_faculty/MyFacultyContribution";
import MyFacultyTable from "../my_faculty/MyFacultyTable";
import { useEffect } from "react";
import { useArticle } from "../../redux/hooks/useArticle";

export default function StudentHomepage() {
  const { getArticleByStudentId } = useArticle();

  // useEffect(() => {
  //   getArticleByStudentId();
  // }, []);

  return (
    <div>
      <MainHeader>
        <Dropdowns>
          <Dropdowns.Dropdown>
            <Dropdowns.Toggle id="your submission">
              <span className="flex items-center gap-3 rounded-3xl py-1 hover:bg-slate-100 xl:px-6">
                <h1 className="text-xl font-normal">Your Submission</h1>
                <img src={DropdownIcon} alt="" />
              </span>
            </Dropdowns.Toggle>

            <Dropdowns.List id="your submission">
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
