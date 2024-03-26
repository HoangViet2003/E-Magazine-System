import UserIcon from "../assets/icons/User_cicrle_light.svg";
import { useOutsideClick } from "../redux/hooks/useOutsideClick";

interface CommentProps {
  setOpenComment: (open: boolean) => void;
}

export default function Comment({ setOpenComment }: CommentProps) {
  const ref = useOutsideClick(
    () => setOpenComment(false),
    false,
  ) as React.RefObject<HTMLDivElement>;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-14 z-10 flex w-96 flex-col gap-5 bg-gray-100 p-5"
    >
      <h4>Comments</h4>

      <div className="flex  max-h-[600px] flex-col gap-5 overflow-scroll bg-white p-5 ">
        <CommentComponent />
        <CommentComponent />
        <CommentComponent />
        <CommentComponent />
        <CommentComponent />
        <CommentComponent />
        <CommentComponent />
        <CommentComponent />
        <CommentComponent />
      </div>

      <button
        className="absolute right-5"
        onClick={() => setOpenComment(false)}
      >
        X
      </button>
    </div>
  );
}

function CommentComponent() {
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

      <p className="text-xs">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </p>
    </div>
  );
}
