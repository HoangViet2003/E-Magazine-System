import { useEffect, useState } from "react";
import profile from "../../../assets/profile1.png";
import { useAuth } from "../../../redux/hooks";
import Spinner from "../../../ui/Spinner";
import { useNavigate } from "react-router-dom";
import Table from "../../../ui/Table";
import AccountTableOperation from "./AccountTableOperation";
import AccountRow from "./AccountRow";
import Pagination from "../../../ui/Pagination";

const AccountTable = () => {
  const { getAllUser, users, isLoadingTable, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    getAllUser(currentPage);
  }, [currentPage]);

  // Function to truncate email address
  const truncateEmail = (email: any, maxLength: any) => {
    if (email.length <= maxLength) return email;
    const truncatedEmail = email.substring(0, maxLength) + "...";
    return truncatedEmail;
  };

  return (
    <div className="">
      {isLoadingTable ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto">
          <Table columns="0.5fr 1fr 1fr 1fr 0.5fr">
            <Table.Header>
              <AccountTableOperation />
            </Table.Header>

            <Table.Body
              data={users}
              render={(data) => (
                <div key={data._id}>
                  <AccountRow data={data} />
                </div>
              )}
            />
          </Table>
        </div>
      )}

      {/* {!isLoading && <Pagination count={10} />} */}

      <div className="join mx-20 mt-9 grid grid-cols-2">
        <button
          className={`btn btn-outline join-item ${currentPage === 1 ? "cursor-not-allowed opacity-50" : ""}`}
          onClick={() => {
            if (currentPage === 1) {
              return;
            }
            setCurrentPage(currentPage - 1);
          }}
        >
          Previous page
        </button>
        <button
          className="btn btn-outline join-item"
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AccountTable;
