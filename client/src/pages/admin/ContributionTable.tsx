import { useEffect, useState } from 'react'
import { useFaculty } from '../../redux/hooks/useFaculty'
import { useNavigate } from 'react-router-dom';
import DataTables from './DataTables';

const FacultyTable = () => {

    const { faculties, getFaculties, deleteFaculty } = useFaculty()
    const navigate = useNavigate();
    useEffect(() => {
        getFaculties()
    }, [])

    const handleDeleteFaculty = (id: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this faculty?');
        if (confirmed) {
            deleteFaculty(id);
        }
    }

    return (
        <div>
            <DataTables
                tableName='faculty'
                data={faculties}
                totalLength={faculties?.length}
                loading={false}
                onPageChange={() => { }}
                handleSearch={() => { }}
                handleDeleteClick={handleDeleteFaculty}
            />

        </div>
    )
}

export default FacultyTable