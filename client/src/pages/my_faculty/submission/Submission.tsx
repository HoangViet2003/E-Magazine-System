import MainHeader from "../../../ui/MainHeader";
import Dropdowns from "../../../ui/Dropdowns";

import BreadcrumbPointer from "../../../assets/icons/breadcrumb-pointer.svg";
import { useNavigate, useParams } from "react-router-dom";
import DropdownIcon from "../../../assets/icons/caret-bottom.svg";
import { useSubmission } from "../../../redux/hooks/useSubmission";
import { useContribution } from "../../../redux/hooks/useContribution";
import SubmissionFile from "./SubmissionFile";
import { useEffect } from "react";
import { useArticle } from "../../../redux/hooks/useArticle";

export default function Submission() {
  const navigate = useNavigate();
  const { submissionId } = useParams();
  const { submissions } = useSubmission();
  const { contributions } = useContribution();
  const { fetchAllArticle } = useArticle();

  useEffect(() => {
    fetchAllArticle();
  }, []);

  const selectedSubmission = submissions.filter(
    (submission) => submission._id === submissionId,
  )[0];

  const contribution = contributions.filter(
    (contribution) => contribution._id === selectedSubmission.contributionId,
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

          <h1
            className="cursor-pointer whitespace-nowrap rounded-3xl py-1 pe-6 text-xl font-normal hover:bg-slate-100 xl:ps-6"
            onClick={() =>
              navigate(`/myFaculty/contributions/${contribution._id}`)
            }
          >
            {contribution.title}
          </h1>
          <img src={BreadcrumbPointer} />

          <Dropdowns>
            <Dropdowns.Dropdown>
              <Dropdowns.Toggle id={selectedSubmission._id}>
                <span className="flex w-44 items-center gap-3 rounded-3xl px-6 py-1 hover:bg-slate-100 md:w-auto">
                  <h1 className="overflow-hidden text-ellipsis whitespace-nowrap text-xl font-normal ">
                    {selectedSubmission.title}
                  </h1>
                  <img src={DropdownIcon} alt="" />
                </span>
              </Dropdowns.Toggle>

              <Dropdowns.List id={selectedSubmission._id}>
                <Dropdowns.Button icon={DropdownIcon}>
                  Download
                </Dropdowns.Button>
                <Dropdowns.Button icon={DropdownIcon}>Delete</Dropdowns.Button>
              </Dropdowns.List>
            </Dropdowns.Dropdown>
          </Dropdowns>
        </div>
      </MainHeader>

      <SubmissionFile />
    </div>
  );
}
