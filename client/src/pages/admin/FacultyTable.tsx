import {useEffect,useState} from 'react'
import { useFaculty } from '../../redux/hooks/useFaculty'
import { useNavigate } from 'react-router-dom';

const FacultyTable = () => {

    const { faculties, getFaculties,deleteFaculty } = useFaculty()
    const navigate = useNavigate();
    useEffect(() => {
        getFaculties()
    },[])

    const handleDeleteFaculty = (id: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this faculty?');
        if (confirmed) {
            deleteFaculty(id);
        }
    }

  return (
      <div className='overflow-x-auto'>
          <table className='table'>
              {/* head */}
              <thead>
                  <tr>
                      <th>Faculty Name</th>
                      <th>Marketing Coordinator</th>
                      <th></th>
                  </tr>
              </thead>
              <tbody>
                  {/* row 1 */}
                  {faculties?.map((faculty) => (
                      <tr key={faculty?._id} className='hover:bg-slate-100' onDoubleClick={() => navigate('/faculty/create', { state: { faculty } })}>
                          <td>
                              <div className='flex items-center gap-3'>

                                  <div>
                                      <div className='font-bold'>{faculty?.name}</div>
                                  </div>
                              </div>
                          </td>
                          <td>
                              {/* Display truncated email */}
                              {faculty?.marketingCoordinatorId?.name}
                              <br />
                              {/* <span className='badge badge-ghost badge-sm whitespace-nowrap'>{user.role}</span> */}
                          </td>
                          <th>
                              <button className='btn btn-ghost btn-xs' onClick={() => handleDeleteFaculty(faculty._id)}>
                                  Delete
                              </button>
                          </th>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  )
}

export default FacultyTable