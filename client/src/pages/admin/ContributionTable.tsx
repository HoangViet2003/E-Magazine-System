import { useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import DataTables from './DataTables';
import { useContribution } from '../../redux/hooks';

const ContributionTable = () => {
    const {contributions,totalPage,totalLength,isLoading,searchContribution,currentPage,handleCurrentPage,fetchAllContributionByManager,deleteContribution} = useContribution()
    const navigate = useNavigate();
    useEffect(() => {
        fetchAllContributionByManager(1)
    }, [])

    // const handleDeleteFaculty = (id: string) => {
    //     const confirmed = window.confirm('Are you sure you want to delete this faculty?');
    //     if (confirmed) {
    //         deleteFaculty(id);
    //     }
    // }

    const handlePageChange = () => {
        if (currentPage + 1 > totalPage) return;
        handleCurrentPage(currentPage + 1);

        fetchAllContributionByManager(currentPage);
    };

    return (
        <div>
            <button className="btn btn-xs sm:btn-md md:btn-md lg:btn-md mb-8" onClick={() => navigate('/contribution/create')}>Create New Contribution</button>
            <DataTables
                tableName='contribution'
                data={contributions}
                totalLength={totalLength || 0}
                loading={isLoading}
                onPageChange={handlePageChange}
                handleSearch={searchContribution}
                handleDeleteClick={deleteContribution}
            />

        </div>
    )
}

export default ContributionTable