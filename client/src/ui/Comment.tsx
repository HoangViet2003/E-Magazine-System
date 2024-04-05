import { useEffect, useRef } from "react";
import UserIcon from "../assets/icons/User_cicrle_light.svg";
import { useOutsideClick } from "../redux/hooks/useOutsideClick";
import { useComment } from "../redux/hooks/useComment";
import { useParams } from "react-router-dom";
import Spinner from "./Spinner";

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
  const { comments, isLoading, fetchAllComment } = useComment();
  const { submissionId } = useParams();

  useEffect(() => {
    fetchAllComment(submissionId);
  }, []);

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

      {isLoading ? (
        <Spinner />
      ) : (
        <div
          className="flex max-h-[600px] flex-col gap-5 overflow-scroll overflow-x-hidden bg-white p-5"
          ref={scrollContainerRef}
        >
          {comments
            .slice()
            .reverse()
            .map((comment) => (
              <CommentComponent comment={comment} />
            ))}
        </div>
      )}

      <input
        type="text"
        className="p-2"
        placeholder="Type your comment here..."
      />

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
