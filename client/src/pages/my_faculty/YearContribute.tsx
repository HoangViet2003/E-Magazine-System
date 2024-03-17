import MainHeader from "../../ui/MainHeader";

import DropdownIcon from "../../assets/icons/caret-bottom.svg";
import MyFacultyTable from "./MyFacultyTable";
import { useNavigate, useParams } from "react-router-dom";

export default function MyFaculty() {
  const { yearContribute } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <MainHeader>
        <span className="flex items-center gap-3">
          <h1
            className="cursor-pointer ps-6 text-xl font-normal"
            onClick={() => navigate("/myFaculty")}
          >
            My Faculty
          </h1>
          <span>{">"}</span>
          <h1 className="ps-6 text-xl font-normal">{yearContribute}</h1>
          <img src={DropdownIcon} alt="" />
        </span>
      </MainHeader>

      <div className="my-5 flex flex-col gap-5 ps-6">
        <MyFacultyTable yearContribute={yearContribute} />
      </div>
    </div>
  );
}
