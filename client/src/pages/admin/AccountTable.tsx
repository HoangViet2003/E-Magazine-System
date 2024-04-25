import { useEffect, useState } from 'react';
import { useAuth } from '../../redux/hooks';
// import Spinner from '../../ui/Spinner';
import { useNavigate } from 'react-router-dom';
import DataTables from './DataTables';

const AccountTable = () => {
    const { getAllUser, users, isLoadingTable, deleteUser,totalPage,totalLength,handleCurrentPage,handleSearchUser } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    // const [filteredUsers, setFilteredUsers] = useState([]);


    const navigate = useNavigate();

    useEffect(() => {
        getAllUser(currentPage);
    }, [currentPage]);



    const handleDeleteClick = (userId :string) => {
        const confirmed = window.confirm('Are you sure you want to delete this user?');
        if (confirmed) {
            deleteUser(userId);
        }
    };

    const handlePageChange = () => {
        if (currentPage + 1 > totalPage) return;
        handleCurrentPage(currentPage + 1);
        setCurrentPage(currentPage + 1);
        getAllUser(currentPage);
    };



    return (
        <div className=''>
            <button className="btn btn-xs sm:btn-md md:btn-md lg:btn-md mb-8" onClick={() => navigate('/account/create')}>Create New Account</button>

            <DataTables
                tableName='account'
                data={users}
                totalLength={totalLength}
                loading={isLoadingTable}
                onPageChange={handlePageChange}
                handleSearch={handleSearchUser}
                handleDeleteClick={handleDeleteClick}
            />
        </div>
    );
};

export default AccountTable;
