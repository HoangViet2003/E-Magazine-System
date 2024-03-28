import { Article } from "../../../redux/slices/ArticleSlice";
import SubmissionDocument from "./SubmissionDocument";
import SubmissionImage from "../../image_collection/ImageCollection";

const SubmissionFile: React.FC<{ articles: Article[] }> = ({ articles }) => {
  return (
    <div className="my-5 flex flex-col gap-5 xl:ps-6">
      <SubmissionDocument articles={articles} />

      <SubmissionImage articles={articles} />
    </div>
  );
};

export default SubmissionFile;
