import { useState, useEffect } from 'react'
import { useFaculty } from '../../redux/hooks/useFaculty'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


const CreateFaculty = () => {
    const [name, setName] = useState('')
    const { createFaculty, updateFaculty } = useFaculty()
    const navigate = useNavigate();
    const location = useLocation();

    const { state } = location;

    const faculty = state && state.row;

    useEffect(() => {
        if (faculty) {
            setName(faculty.name || '')
        }

    }, [faculty])

    const handleSubmit = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const data = {
            name: name
        }
        if (faculty) {
            updateFaculty(faculty._id, data)
            navigate('/faculty')
            return
        }
        createFaculty(data)
    }

    return (
        <div className="">
            <h1 className="mb-6 font-bold">{faculty ? 'Update' : 'Create'} Faculty</h1>
            <div className="flex items-center justify-center">
                <form className="w-full max-w-lg" onSubmit={handleSubmit}>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full  px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                Faculty Name
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" value={name} type="text" placeholder="Jane" onChange={(e) => setName(e.target.value)} />
                            {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
                        </div>

                    </div>






                    <button className="btn btn-xs sm:btn-md md:btn-md lg:btn-md mt-3" >{faculty ? 'Update' : 'Create'}</button>

                </form>

            </div>
        </div>


    )
}

export default CreateFaculty