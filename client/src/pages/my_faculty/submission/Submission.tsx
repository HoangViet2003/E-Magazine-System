import MainHeader from "../../../ui/MainHeader";
import Dropdowns from "../../../ui/Dropdowns";

import BreadcrumbPointer from "../../../assets/icons/breadcrumb-pointer.svg";
import { useNavigate, useParams } from "react-router-dom";
import DropdownIcon from "../../../assets/icons/caret-bottom.svg";
import { useSubmission } from "../../../redux/hooks/useSubmission";
import SubmissionFile from "./SubmissionFile";
import { useEffect, useState } from "react";
import { useArticle } from "../../../redux/hooks/useArticle";
import Spinner from "../../../ui/Spinner";
import { Submission as SubmissionObj } from "../../../redux/slices/SubmissionSlice";
import MyFacultyTable from "../MyFacultyTable";
import SubmissionTable from "./SubmissionTable";

export default function Submission() {
  const navigate = useNavigate();
  const { submissionId } = useParams();
  // const { submissions, fetchAllSubmission, getSubmissionByStudent } =
  //   useSubmission();
  // const { getArticlesBySubmissionId, isLoading } = useArticle();
  // const [articles, setArticles] = useState([]);
  const role = localStorage.getItem("role");
  const [currSubmission, setCurrSubmission] = useState<SubmissionObj>();

  useEffect(() => {
    const getSubmission = async () => {
      if (role === "student") {
        const fetchedSubmission = await getSubmissionByStudent();
        setCurrSubmission(fetchedSubmission);
      }
    };

    getSubmission();
  }, []);

  // const selectedSubmission = submissions.filter(
  //   (submission) => submission._id === submissionId,
  // )[0];

  return (
    <div>
      {currSubmission && (
        <MainHeader>
          <div className="relative flex items-center">
            <h1
              className="cursor-pointer whitespace-nowrap rounded-3xl py-1 pe-6 text-xl font-normal hover:bg-slate-100 xl:ps-6"
              onClick={() => navigate("/myFaculty")}
            >
              My Faculty
            </h1>
            <img src={BreadcrumbPointer} />

            <h1
              className="cursor-pointer whitespace-nowrap rounded-3xl py-1 pe-6 text-xl font-normal hover:bg-slate-100 xl:ps-6"
              onClick={() =>
                role === "student"
                  ? navigate(
                      `/student/contributions/${currSubmission.contributionId._id}`,
                    )
                  : navigate(
                      `/myFaculty/contributions/${currSubmission.contributionId._id}`,
                    )
              }
            >
              {`${currSubmission.contributionId.academicYear} Contribution`}
            </h1>
            <img src={BreadcrumbPointer} />

            {submissionId && (
              <Dropdowns>
                <Dropdowns.Dropdown>
                  <Dropdowns.Toggle id={submissionId}>
                    <span className="flex w-44 items-center gap-3 rounded-3xl px-6 py-1 hover:bg-slate-100 md:w-auto">
                      <h1 className="overflow-hidden text-ellipsis whitespace-nowrap text-xl font-normal ">
                        {currSubmission.user.name}
                      </h1>
                      <img src={DropdownIcon} alt="" />
                    </span>
                  </Dropdowns.Toggle>

                  <Dropdowns.List id={submissionId}>
                    <Dropdowns.Button icon={DropdownIcon}>
                      Download
                    </Dropdowns.Button>
                    <Dropdowns.Button icon={DropdownIcon}>
                      Delete
                    </Dropdowns.Button>
                  </Dropdowns.List>
                </Dropdowns.Dropdown>
              </Dropdowns>
            )}
          </div>
        </MainHeader>
      )}

      <div className="my-5 flex flex-col gap-5 xl:ps-6">
        <SubmissionTable />
      </div>
    </div>
  );
}
