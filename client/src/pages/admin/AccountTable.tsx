import React, { useEffect, useState } from 'react';
import profile from '../../assets/profile1.png';
import { useAuth } from '../../redux/hooks';
import Spinner from '../../ui/Spinner';
import { useNavigate } from 'react-router-dom';
import DataTables from './Datatables';
import { User } from '../../redux/slices/UserSlice';

const AccountTable = () => {
    const { getAllUser, users, isLoadingTable, deleteUser } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    // const [filteredUsers, setFilteredUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);


    const navigate = useNavigate();

    useEffect(() => {
        getAllUser(currentPage);
    }, [currentPage]);

    // Function to truncate email address
    const truncateEmail = (email:any, maxLength:any) => {
        if (email.length <= maxLength) return email;
        const truncatedEmail = email.substring(0, maxLength) + '...';
        return truncatedEmail;
    };

    const handleDeleteClick = (userId :string) => {
        const confirmed = window.confirm('Are you sure you want to delete this user?');
        if (confirmed) {
            deleteUser(userId);
        }
    };



    return (
        <div className=''>
         
            

            <DataTables
                tableName='account'
                data={users}
                totalLength={users?.length}
                loading={isLoadingTable}
                onPageChange={() => setCurrentPage(currentPage + 1)}
                handleSearch={() => {}}
            />
        </div>
    );
};

export default AccountTable;
