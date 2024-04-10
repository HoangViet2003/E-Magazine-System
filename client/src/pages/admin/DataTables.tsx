import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';

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
    const { tableName, data, totalLength, onPageChange, loading, handleSearch,handleDeleteClick } =
        props;


    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState<any[]>([]);



    const navigate = useNavigate();


    let columns: Column[] = [];

    if (tableName === 'account') {
        columns = [

            { name: 'name', selector: (row) => row.name, sortable: true },
            { name: 'email', selector: (row) => row.email, sortable: true },
            { name: 'role', selector: (row) => row.role, sortable: true },
            {
                name: 'created at',
                selector: (row) =>
                    new Date(row.createdAt).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    }),
            },
            //button for delete
            {
                name: 'Action',
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
    } else if (tableName === 'faculty') {
        columns = [
            {
                name: 'id',
                selector: (row) => row._id,
            },
            {
                name: 'faculty name',
                selector: (row) => row.name,
            },
            {
                name: 'marketing coordinator',
                selector: (row) => row?.marketingCoordinatorId?.name,
            },
            {
                name: 'Action',
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
                name: 'created at',
                selector: (row) =>
                    new Date(row.createdAt).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    }),
            },
        ];
    } else if (tableName === 'users') {
        columns = [
            {
                name: 'id',
                selector: (row) => row.id,
            },
            {
                name: 'name',
                selector: (row) => row.fullname,
            },
            {
                name: 'email',
                selector: (row) => row.email,
            },
            {
                name: 'role',
                selector: (row) => (row.isAdmin ? 'admin' : 'user'),
            },
        ];
    }
    

    const handleSearchData = (e: any) => {
        setSearchText(e.target.value);

        handleSearch(e.target.value);
    };
    // const handleSearchData = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const searchText = e.target.value.toLowerCase();
    //     setSearchText(searchText);

    //     const filteredData = props.data.filter((item: any) => {
    //         // Check if any column's value contains the search text
    //         return Object.values(item).some(
    //             (value) => typeof value === 'string' && value.toLowerCase().includes(searchText)
    //         );
    //     });

    //     // Call the handleSearch function with the filtered data
    //     handleSearch(filteredData);
    // };





    return (
        <div
            className='dashboard-table-area section-padding-100'
            style={{
                width: '70%',
            }}
        >
            <div className='cart-title mt-50'>
                <h2>
                    {tableName === 'account'
                        ? 'Accounts'
                        : tableName === 'faculty'
                            ? 'Faculty'
                            : tableName === 'users'
                                ? 'Users'
                                : 'Transaction'}
                    {' '}
                    Dashboard
                </h2>

                <input
                    type='text'
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
                    if (tableName === 'account') {
                        navigate('/account/create', { state: { row } })
                    } else if (
                        tableName === 'faculty'
                    ) {
                        navigate('/faculty/create', { state: { row } })
                    } else if (tableName === 'contribution') {
                        navigate('/contribution/create', { state: { row } })
                    } 
                }
                }
            />
        </div>
    );
};
export default DataTables;
