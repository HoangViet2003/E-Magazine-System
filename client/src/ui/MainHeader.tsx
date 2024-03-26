import { ReactNode, useState } from "react";
import { useParams } from "react-router-dom";

import UlListIcon from "../assets/icons/list-ul.svg";
import InfoLineIcon from "../assets/icons/Icon-info-circle-line.svg";
import CheckIcon from "../assets/icons/check_ring_round_light.svg";
import CommentIcon from "../assets/icons/comment_duotone.svg";
import ShareIcon from "../assets/icons/Out.svg";
import Comment from "./Comment";

const MainHeader: React.FC<{ children: ReactNode }> = ({ children }) => {
  const params = useParams();
  const [openComment, setOpenComment] = useState(false);

  return (
    <div className="flex items-center justify-between border-b border-borderColor py-4">
      {children}

      <div className="relative hidden lg:inline-block">
        {params.submissionId && (
          <div className="flex">
            <button className="flex items-center gap-3 px-2 py-1 hover:bg-slate-100">
              <img src={CheckIcon} />
              Select
            </button>
            <button
              className="flex items-center gap-3 px-2 py-1 hover:bg-slate-100"
              onClick={() => setOpenComment(!openComment)}
            >
              <img src={CommentIcon} />
              Comments
            </button>
            <button className="flex items-center gap-3 px-2 py-1 hover:bg-slate-100">
              <img src={ShareIcon} />
              Share
            </button>
            {openComment && (
              <Comment
                openComment={openComment}
                setOpenComment={setOpenComment}
              />
            )}
          </div>
        )}

        {!params.submissionId && (
          <>
            <button className="rounded-full p-3 hover:bg-slate-100">
              <img src={UlListIcon} />
            </button>
            <button className="rounded-full p-3 hover:bg-slate-100">
              <img src={InfoLineIcon} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MainHeader;
