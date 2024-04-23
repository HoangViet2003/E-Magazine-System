import { useEffect, useState } from "react";
import { useOutsideClick } from "../redux/hooks/useOutsideClick";
import { useComment } from "../redux/hooks/useComment";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import SpinnerMini from "./SpinnerMini";
import CommentComponent from "./CommentComponent";
import CloseIcon from "../assets/icons/cross-svgrepo-com.svg";
import PlusIcon from "../assets/icons/sidebar-icons/plusIcon";
import PlayIcon from "../assets/icons/play-1003-svgrepo-com.svg";
import { useCommentContext } from "./CommentContext";
import LockIcon from "../assets/icons/lock-alt.svg";
import CommentIcon from "../assets/icons/comment-3-svgrepo-com.svg";

export default function Comment({ allowComment }: { allowComment: boolean }) {
  const {
    comments,
    fetchAllComment,
    sendComment,
    totalLength,
    fetchMoreComment,
    isLoading,
  } = useComment();
  const { submissionId } = useParams();
  const [content, setContent] = useState("");
  const [page, setPage] = useState(2);
  const [openCommentInput, setOpenCommentInput] = useState(false);
  const [openReply, setOpenReply] = useState("");
  const { openComment, setOpenComment } = useCommentContext();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!content) return;
    sendComment(content, submissionId);
    setContent("");
    setOpenCommentInput(false);
  }

  useEffect(() => {
    fetchAllComment(submissionId);
  }, []);

  function fetchMoreData() {
    setTimeout(() => {
      if (!isLoading) {
        fetchMoreComment(submissionId, page);
        setPage((prevPage) => {
          return prevPage + 1;
        });
      }
    }, 1500);
  }

  const ref = useOutsideClick(() => {
    setOpenCommentInput(false);
    setOpenReply("");
  }, false) as React.RefObject<HTMLDivElement>;

  return (
    <div
      className={`fixed right-4 z-10 flex flex-col justify-between gap-5 bg-gray-100 p-5 duration-300 ${openComment ? "bottom-0 opacity-100" : "-bottom-[100%] opacity-0"}`}
      ref={ref}
    >
      <div className="flex w-[360px] flex-col justify-between gap-5">
        <div className="flex items-center gap-2">
          <h4>Comments</h4>
          <button
            className={`rounded-full p-2 ${allowComment ? "hover:bg-slate-200" : ""} `}
            onClick={() => {
              setOpenCommentInput(true);
              setOpenReply("");
            }}
            disabled={!allowComment}
          >
            {allowComment ? (
              <PlusIcon fill="#6B6C7E" />
            ) : (
              <div className="flex gap-2 rounded-full bg-red-500 p-1 px-2">
                <img src={LockIcon} className="w-5" />
                <p className="text-sm text-white">Lock comment</p>
              </div>
            )}
          </button>
        </div>

        <div>
          <div
            id="scrollableDiv"
            className={`flex h-[400px] overflow-auto scroll-smooth bg-white p-5 ${comments && comments.length > 0 ? "flex-col-reverse" : "items-center justify-center"}`}
          >
            {comments && comments.length > 0 ? (
              <>
                <span className="mt-1 flex justify-end text-xs">
                  {!isLoading && "Sent"}
                </span>
                <InfiniteScroll
                  dataLength={comments.length}
                  next={fetchMoreData}
                  style={{}}
                  className="flex flex-col-reverse gap-5 scroll-smooth" 
                  inverse={true} //
                  hasMore={comments.length < totalLength}
                  loader={
                    <div className="overflow-hidden">
                      <SpinnerMini />
                    </div>
                  }
                  scrollableTarget="scrollableDiv"
                >
                  {comments.map((comment, index) => (
                    <CommentComponent
                      comment={comment}
                      key={index}
                      openReply={openReply}
                      setOpenReply={setOpenReply}
                      setOpenCommentInput={setOpenCommentInput}
                      allowComment={allowComment}
                    />
                  ))}
                </InfiniteScroll>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <img src={CommentIcon} width={50} />
                <div>Add new Comment</div>
              </div>
            )}
          </div>

          {(openCommentInput || totalLength === 0) && allowComment && (
            <form onClick={handleSubmit}>
              <div className="mt-3 flex items-center bg-white">
                <input
                  type="text"
                  className="w-full p-2"
                  placeholder="Type your comment here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={!allowComment}
                />
                <button type="submit" className="p-3">
                  <img src={PlayIcon} className="w-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <button
        className="absolute right-5"
        onClick={() => setOpenComment(false)}
      >
        <img className="w-8" src={CloseIcon} />
      </button>
    </div>
  );
}
