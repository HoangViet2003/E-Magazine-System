import { useEffect, useRef, useState } from "react";
import UserIcon from "../assets/icons/User_cicrle_light.svg";
import { useOutsideClick } from "../redux/hooks/useOutsideClick";
import { useComment } from "../redux/hooks/useComment";
import { useParams } from "react-router-dom";
import Spinner from "./Spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import SpinnerMini from "./SpinnerMini";

interface CommentProps {
  openComment: boolean;
  setOpenComment: (open: boolean) => void;
}

export default function Comment({ openComment, setOpenComment }: CommentProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const ref = useOutsideClick(
    () => setOpenComment(false),
    false,
  ) as React.RefObject<HTMLDivElement>;
  const {
    comments,
    isLoading,
    fetchAllComment,
    sendComment,
    totalLength,
    fetchMoreComment,
  } = useComment();
  const { submissionId } = useParams();
  const [content, setContent] = useState("");
  const [page, setPage] = useState(2);

  console.log("ccmt", comments.length);
  console.log("totalLength", totalLength);

  function handleSubmit(e) {
    e.preventDefault();
    if (!content) return;
    sendComment(content, submissionId);
    setContent("");
  }

  useEffect(() => {
    fetchAllComment(submissionId);
  }, []);

  function fetchMoreData() {
    fetchMoreComment(submissionId, page);
    setPage(page + 1);
  }

  useEffect(() => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      scrollContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [comments]);

  return (
    <div
      ref={ref}
      className={`fixed right-4 z-10 flex h-[500px] w-96 flex-col justify-between gap-5 bg-gray-100 p-5 duration-300 ${openComment ? "bottom-0 opacity-100" : "-bottom-[500px] opacity-0"}`}
    >
      <h4>Comments</h4>

      <div
        id="scrollableDiv"
        style={{
          overflow: "auto",
          flexDirection: "column-reverse",
        }}
        className="flex max-h-[500px] flex-col overflow-scroll bg-white p-5"
      >
        <InfiniteScroll
          dataLength={totalLength}
          next={fetchMoreData}
          style={{}} //To put endMessage and loader to the top.
          className="flex flex-col-reverse gap-5"
          inverse={true} //
          hasMore={!(comments.length === totalLength)} // TODO: change to dynamic
          loader={
            <div className="overflow-hidden">
              <SpinnerMini />
            </div>
          }
          scrollableTarget="scrollableDiv"
        >
          {comments.map((comment, index) => (
            <CommentComponent comment={comment} key={index} />
          ))}
        </InfiniteScroll>
      </div>

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
      <button
        className="absolute right-5"
        onClick={() => setOpenComment(false)}
      >
        X
      </button>
    </div>
  );
}

function CommentComponent({ comment }) {
  const { _id, content, createdAt } = comment;
  const currentDate = new Date("2024-03-26T06:53:57.849Z");

  // Format the date as "Month Day, Year"
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Function to format the time
  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedHours = hours < 10 ? "0" + hours : hours;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    return `${formattedHours}:${formattedMinutes}`;
  };

  // Function to check if the date is today
  const isToday = (date: Date) => {
    const today = new Date();
    const d = new Date(date);
    return d.toDateString() === today.toDateString();
  };

  return (
    <div className="flex flex-col gap-[10px] bg-[#EEEEEE] p-3">
      <div className="flex items-center gap-1">
        <img src={UserIcon} alt="user image" />

        <div>
          <div className="text-sm font-medium">Ngo Tuan Anh</div>
          <div className="text-[10px] font-light">
            {formatTime(currentDate)}{" "}
            {isToday(currentDate) ? "Today" : formatDate(currentDate)}
          </div>
        </div>
      </div>

      <p className="text-xs">{content}</p>
    </div>
  );
}
