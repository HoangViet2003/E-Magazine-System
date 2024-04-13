import { useState, useEffect, useCallback } from "react"
import { useFaculty } from "../../redux/hooks/useFaculty"
import { useAuth } from "../../redux/hooks";
import { useLocation, useNavigate } from 'react-router-dom';


const CreateAccount = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('student')
    const [faculty, setFaculty] = useState('')
    const [isShowFaculty, setIsShowFaculty] = useState(true)
    const { faculties, getFaculties, createAccount } = useFaculty()
    const { updateUser } = useAuth()
    const location = useLocation();

    const { state } = location;

    const user = state && state.row;

    const navigate = useNavigate();

    console.log("facultyId", faculty)


    useEffect(() => {
        getFaculties()
    }, [])

    useEffect(() => {
        if (user) {
            setName(user.name || '')
            setEmail(user.email || '')
            setRole(user.role)

            const matchFaculty = faculties.find(faculty => faculty._id === user.facultyId)
            if (matchFaculty) {
                setFaculty(matchFaculty._id)
            }

        }

    }, [user])

    useEffect(() => {
        if (role === "marketing manager") {
            setIsShowFaculty(false)
        } else {
            setIsShowFaculty(true)
        }

    }, [role])

    const handleSubmit = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const data = {
            name: name,
            email: email,
            password: password,
            role: role,
            facultyId: faculty

        }
        if (user) {
            updateUser(user._id, data)
            return
        }

        console.log(data)
        createAccount(data)
    }

    useEffect(() => {
        // Check if there is only one faculty and set the value
        if (faculties && faculties.length === 1) {
            setFaculty(faculties[0]._id);
        }
    }, []);



    const handleSetFacultyId = (e: any) => {
        setFaculty(e.target.value)
    }




    return (
        <div className="">
            <h1 className="mb-6 font-bold">Create Account</h1>
            <div className="flex items-center justify-center">
                <form className="w-full max-w-lg" onSubmit={handleSubmit} >
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                Name
                            </label>
                            <input value={name}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="Jane" onChange={(e) => setName(e.target.value)} />
                            {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                Email
                            </label>
                            <input value={email} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="email" placeholder="@gmail.com" onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                Password
                            </label>
                            <input value={password} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="password" placeholder="******************" onChange={(e) => setPassword(e.target.value)} />
                            <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-2">

                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                Role
                            </label>
                            <div className="relative">
                                <select value={role} className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state" onChange={(e) => setRole(e.target.value)}>
                                    <option value='student'>Student</option>
                                    <option value='marketing coordinator'>Marketing Coordinator</option>
                                    <option value='marketing manager'>Marketing Manager</option>
                                    <option value='guest'>Guest</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>
                        </div>

                        {isShowFaculty && <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                Faculty
                            </label>
                            <div className="relative">
                                <select value={faculty}  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state" onChange={handleSetFacultyId}>
                                    {faculties?.map(faculty => (
                                        <option key={faculty._id} value={faculty._id}>{faculty.name}</option>

                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>
                        </div>}


                    </div>
                    <button className="btn btn-xs sm:btn-md md:btn-md lg:btn-md mt-6" >{user ? 'Update' : 'Create'}</button>

                </form>

            </div>
        </div>
    )
}

export default CreateAccount