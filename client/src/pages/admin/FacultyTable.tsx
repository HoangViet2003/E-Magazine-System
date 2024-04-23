import { useEffect } from "react";
import { useFaculty } from "../../redux/hooks/useFaculty";
import { useNavigate } from "react-router-dom";
import DataTables from "./DataTables";

const FacultyTable = () => {
  const {
    faculties,
    getFaculties,
    deleteFaculty,
    totalPages,
    totalLength,
    handleCurrentPage,
    currentPage,
    isLoading,
    handleSearchFaculty,
  } = useFaculty();
  const navigate = useNavigate();
  useEffect(() => {
    getFaculties(currentPage);
  }, []);

  const handleDeleteFaculty = (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this faculty?",
    );
    if (confirmed) {
      deleteFaculty(id);
    }
  };

  const handlePageChange = () => {
    if (currentPage + 1 > totalPages) return;
    handleCurrentPage(currentPage + 1);

    getFaculties(currentPage);
  };

  return (
    <div>
      <button
        className="btn btn-xs mb-8 sm:btn-md md:btn-md lg:btn-md"
        onClick={() => navigate("/faculty/create")}
      >
        Create New Faculty
      </button>

      <DataTables
        tableName="faculty"
        data={faculties}
        totalLength={totalLength}
        loading={isLoading}
        onPageChange={handlePageChange}
        handleSearch={handleSearchFaculty}
        handleDeleteClick={handleDeleteFaculty}
      />
    </div>
  );
};

export default FacultyTable;
