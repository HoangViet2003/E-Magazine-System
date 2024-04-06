import { useEffect, useState } from "react";
import { useOutsideClick } from "../redux/hooks/useOutsideClick";
import { useComment } from "../redux/hooks/useComment";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import SpinnerMini from "./SpinnerMini";
import CommentComponent from "./CommentComponent";

interface CommentProps {
  openComment: boolean;
  setOpenComment: (open: boolean) => void;
}

export default function Comment({ openComment, setOpenComment }: CommentProps) {
  const {
    comment,
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
      fetchMoreComment(submissionId, page);
      setPage((prevPage) => {
        return prevPage + 1;
      });
    }, 1500);
  }

  const ref = useOutsideClick(() => {
    setOpenCommentInput(false);
    setOpenReply("");
  }, false) as React.RefObject<HTMLDivElement>;

  // console.log("cmt", comments.length);
  // console.log("length", totalLength);

  return (
    <div
      className={`fixed right-4 z-10 flex h-[800px] w-[600px] flex-col justify-between gap-5 bg-gray-100 p-5 duration-300 ${openComment ? "bottom-0 opacity-100" : "-bottom-[800px] opacity-0"}`}
      ref={ref}
    >
      <h4>
        Comments
        <button
          className="btn btn-info ms-4"
          onClick={() => {
            setOpenCommentInput(true);
            setOpenReply("");
          }}
        >
          +
        </button>
      </h4>

      <div
        id="scrollableDiv"
        className="flex max-h-[800px] flex-col-reverse overflow-auto scroll-smooth bg-white p-5"
      >
        <span className="flex justify-end text-xs">
          {isLoading ? "Sending..." : "Sent"}
        </span>
        <InfiniteScroll
          dataLength={comments.length}
          next={fetchMoreData}
          style={{}} //To put endMessage and loader to the top.
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
            />
          ))}
        </InfiniteScroll>
      </div>

      {openCommentInput && (
        <form onClick={handleSubmit}>
          <div className="flex items-center">
            <input
              type="text"
              className="w-full p-2"
              placeholder="Type your comment here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button type="submit">O</button>
          </div>
        </form>
      )}
      <button
        className="absolute right-5"
        onClick={() => setOpenComment(false)}
      >
        X
      </button>
    </div>
  );
}
