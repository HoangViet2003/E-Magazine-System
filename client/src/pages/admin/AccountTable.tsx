import React, { useEffect, useState } from 'react';
import profile from '../../assets/profile1.png';
import { useAuth } from '../../redux/hooks';
import Spinner from '../../ui/Spinner';
import { useNavigate } from 'react-router-dom';

const AccountTable = () => {
    const { getAllUser, users, isLoadingTable, deleteUser } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);

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
            {isLoadingTable ? (
                <Spinner />
            ) : (
                <div className='overflow-x-auto'>
                    <table className='table'>
                        {/* head */}
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* row 1 */}
                            {users?.map((user) => (
                                <tr key={user?._id} className='hover:bg-slate-100' onDoubleClick={() => navigate('/account/create', { state: { user } })}>
                                    <td>
                                        <div className='flex items-center gap-3'>
                                            <div className='avatar max-md:hidden'>
                                                <div className='mask mask-squircle w-12 h-12'>
                                                    <img src={profile} alt='Avatar Tailwind CSS Component' />
                                                </div>
                                            </div>
                                            <div>
                                                <div className='font-bold'>{user.name}</div>
                                                <div className='text-sm opacity-50'>Viet Nam</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {/* Display truncated email */}
                                        {truncateEmail(user.email, 15)}
                                        <br />
                                        <span className='badge badge-ghost badge-sm whitespace-nowrap'>{user.role}</span>
                                    </td>
                                    <th>
                                        <button className='btn btn-ghost btn-xs' onClick={()  => handleDeleteClick(user._id)}>
                                            Delete
                                        </button>
                                    </th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className='join grid grid-cols-2 mt-9 mx-20'>
                <button
                    className={`join-item btn btn-outline ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => {
                        if (currentPage === 1) {
                            return;
                        }
                        setCurrentPage(currentPage - 1);
                    }}
                >
                    Previous page
                </button>
                <button className='join-item btn btn-outline' onClick={() => setCurrentPage(currentPage + 1)}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default AccountTable;
