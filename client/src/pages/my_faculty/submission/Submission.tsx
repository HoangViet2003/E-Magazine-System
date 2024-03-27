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

export default function Submission() {
  const navigate = useNavigate();
  const { submissionId } = useParams();
  const { submissions, fetchAllSubmission } = useSubmission();
  const { getArticlesBySubmissionId, isLoading } = useArticle();
  const [articles, setArticles] = useState([]);
  const role = localStorage.getItem("role");


  useEffect(() => {
    const fetchArticles = async () => {
      if (submissionId) {
        const fetchedArticles = await getArticlesBySubmissionId(submissionId);
        setArticles(fetchedArticles);
      }
    };
    fetchArticles();
    fetchAllSubmission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId]); // Corrected dependency: submissionId only

  const selectedSubmission = submissions.filter(
    (submission) => submission._id === submissionId,
  )[0];

  return (
    <div>
      {selectedSubmission && (
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
                navigate(
                  `/myFaculty/contributions/${selectedSubmission.contributionId._id}`,
                )
              }
            >
              {`${selectedSubmission.contributionId.academicYear} Contribution`}
            </h1>
            <img src={BreadcrumbPointer} />

            {submissionId && (
              <Dropdowns>
                <Dropdowns.Dropdown>
                  <Dropdowns.Toggle id={submissionId}>
                    <span className="flex w-44 items-center gap-3 rounded-3xl px-6 py-1 hover:bg-slate-100 md:w-auto">
                      <h1 className="overflow-hidden text-ellipsis whitespace-nowrap text-xl font-normal ">
                        {selectedSubmission.user.name}
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

      {isLoading ? (
        <Spinner />
      ) : articles && articles.length > 0 ? (
        <SubmissionFile articles={articles} />
      ) : (
        <div>No articles found.</div>
      )}
    </div>
  );
}
