import { useSearchParams } from "react-router-dom";
import OrderArrowIcon from "../../../assets/icons/order-arrow-up.svg";
const ellipsis = "overflow-hidden text-ellipsis whitespace-nowrap";

export default function ManagerOperation() {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
      <div></div>
      <div className={ellipsis + " flex cursor-pointer select-none gap-1"}>
        Name
      </div>

      <div className={ellipsis + " flex cursor-pointer select-none gap-1"}>
        Modified Date
      </div>
    </>
  );
}
