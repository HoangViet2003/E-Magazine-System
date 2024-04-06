import { useRef, useState } from "react";
import UserIcon from "../assets/icons/User_cicrle_light.svg";
import { Comment } from "../redux/slices/CommentSlice";
import { useComment } from "../redux/hooks/useComment";
import { useParams } from "react-router-dom";

interface CommentComponentProps {
  comment: Comment;
  openReply: string;
  setOpenReply: (id: string) => void;
  setOpenCommentInput: (input: boolean) => void;
}

export default function CommentComponent({
  comment,
  openReply,
  setOpenReply,
  setOpenCommentInput,
}: CommentComponentProps) {
  const selectedRef = useRef(null);
  const { _id, content, createdAt, replies, userId: user } = comment;
  const createdDate = new Date(createdAt);
  const [replyContent, setReplyContent] = useState("");
  const { replyComment } = useComment();
  const { submissionId } = useParams();

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

  const isToday = (date: Date) => {
    const today = new Date();
    const d = new Date(date);
    return d.toDateString() === today.toDateString();
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (content === "") return;
    replyComment(replyContent, submissionId, _id);
    setReplyContent("");
  }

  const handleSelect = (ref: React.RefObject<HTMLElement> | null) => {
    if (ref && ref.current)
      ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <>
      <div
        className="flex cursor-pointer flex-col gap-[20px] bg-[#EEEEEE] p-3 hover:bg-[#e2e2e2]"
        onClick={() => {
          setOpenReply(_id);
          setOpenCommentInput(false);
          handleSelect(selectedRef);
        }}
        ref={selectedRef}
      >
        <div>
          <div className="flex items-center gap-1">
            <img src={UserIcon} alt="user image" />

            <div>
              <div className="text-sm font-medium">{user?.name}</div>
              <div className="text-[10px] font-light">
                {formatTime(createdDate)}{" "}
                {isToday(createdDate) ? "Today" : formatDate(createdDate)}
              </div>
            </div>
          </div>

          <p className="text-xs">{content}</p>
        </div>

        {replies &&
          replies.length > 0 &&
          replies.map((reply: Comment) => (
            <div key={reply._id}>
              <div className="flex items-center gap-1">
                <img src={UserIcon} alt="user image" />

                <div>
                  <div className="text-sm font-medium">
                    {reply?.userId?.name}
                  </div>
                  <div className="text-[10px] font-light">
                    {formatTime(createdDate)}{" "}
                    {isToday(createdDate) ? "Today" : formatDate(createdDate)}
                  </div>
                </div>
              </div>

              <p className="text-xs">{reply.content}</p>
            </div>
          ))}

        {openReply === _id && (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center">
              <input
                type="text"
                className="w-full p-1"
                placeholder="Type your comment here..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <button type="submit">O</button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
