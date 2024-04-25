import { useState } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";

interface Column {
  name: string;
  selector: (row: any) => any;
  sortable?: boolean;
}

const DataTables = (props: {
  tableName: string;
  data: any[];
  totalLength: number;
  onPageChange: any;
  loading: boolean;
  handleSearch: any;
  handleDeleteClick?: any;
  // onRowDoubleClicked?: any;
}) => {
  const {
    tableName,
    data,
    totalLength,
    onPageChange,
    loading,
    handleSearch,
    handleDeleteClick,
  } = props;

  const [searchText, setSearchText] = useState("");
  // const [filteredData, setFilteredData] = useState<any[]>([]);

  const navigate = useNavigate();

  let columns: Column[] = [];

  if (tableName === "account") {
    columns = [
      { name: "name", selector: (row) => row.name, sortable: true },
      { name: "email", selector: (row) => row.email, sortable: true },
      { name: "role", selector: (row) => row.role, sortable: true },
      {
        name: "created at",
        selector: (row) =>
          new Date(row.createdAt).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
      },
      //button for delete
      {
        name: "Action",
        selector: (row) => (
          <button
            onClick={() => {
              handleDeleteClick(row._id);
            }}
          >
            Delete
          </button>
        ),
      },
    ];
  } else if (tableName === "faculty") {
    columns = [
      {
        name: "id",
        selector: (row) => row._id,
      },
      {
        name: "faculty name",
        selector: (row) => row.name,
      },
      {
        name: "marketing coordinator",
        selector: (row) => row?.marketingCoordinatorId?.name,
      },
      {
        name: "Action",
        selector: (row) => (
          <button
            onClick={() => {
              handleDeleteClick(row._id);
            }}
          >
            Delete
          </button>
        ),
      },
      {
        name: "created at",
        selector: (row) =>
          new Date(row.createdAt).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
      },
    ];
  } else if (tableName === "contribution") {
    columns = [
      {
        name: "academicYear",
        selector: (row) => row.academicYear,
      },{
        name: "status",
        selector: (row) => row.status,
      },{
        name: "closure date",
        selector: (row) =>
          new Date(row.closureDate).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
      },{
        name:"final closure date",
        selector:(row)=>new Date(row.finalClosureDate).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      } , {
        name: "Action",
        selector: (row) => (
          <button
            onClick={() => {
              handleDeleteClick(row.academicYear);
            }}
          >
            Delete
          </button>
        ),
      },

  
    ];
  }

  const handleSearchData = (e: any) => {
    setSearchText(e.target.value);

    handleSearch(e.target.value);
  };


  return (
    <div
      className="dashboard-table-area section-padding-100"
      style={{
        width: "100%",
      }}
    >
      <div className="cart-title mt-50">
        <h2>
          {tableName === "account"
            ? "Accounts "
            : tableName === "faculty"
              ? "Faculty "
                : "Contribution "}
          Dashboard
        </h2>

        <input
          type="text"
          placeholder={`Search ${tableName}`}
          value={searchText}
          onChange={(e) => handleSearchData(e)}
          style={{ marginTop: 5, marginBottom: 5, padding: 5, fontSize: 12 }}
        />
      </div>

      <DataTable
        columns={columns}
        data={data}
        striped
        highlightOnHover
        pagination
        paginationServer
        paginationTotalRows={totalLength}
        progressPending={loading}
        onChangePage={onPageChange}
        onRowDoubleClicked={(row: any) => {
          if (tableName === "account") {
            navigate("/account/create", { state: { row } });
          } else if (tableName === "faculty") {
            navigate("/faculty/create", { state: { row } });
          } else if (tableName === "contribution") {
            navigate("/contribution/create", { state: { row } });
          }
        }}
      />
    </div>
  );
};
export default DataTables;
