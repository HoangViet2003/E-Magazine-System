import axios from "../../utils/axios.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../index";
import {
  setLoadingUser,
  setUser,
  setUsers,
  setIsLoadingTable,
  setTotalPage,
  setTotalLength,
  setCurrentPage
} from "../slices/UserSlice";
import {
  GET_API,
  DELETE_API,
  POST_API,
  PATCH_API,
} from "../../constants/api.js";
import { toast } from "react-toastify";

export function useAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuth, isLoading, user, users, isLoadingTable,totalPage,totalLength } = useSelector(
    (state: RootState) => state.user,
  );

  const setUserFromToken = async (userToken?: string) => {
    dispatch(setLoadingUser(true));

    if (userToken) {
      const { _id, name, email, facultyId, role, createdAt, updatedAt } =
        JSON.parse(userToken);

      dispatch(
        setUser({ _id, name, facultyId, email, role, createdAt, updatedAt }),
      );
    }
    dispatch(setLoadingUser(false));
  };

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    dispatch(setLoadingUser(true));

    try {
      const { data } = await axios.post(POST_API().LOGIN, {
        email,
        password,
      });

      if (data.status === "success") {
        dispatch(setUser(data.user));

        localStorage.setItem("token", data.token.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", data.user.role);

        toast.success("Login successfully");

        navigate("/dashboard", { replace: true });
      } else {
        toast.error("Provided email or password are incorrect");
      }
    } catch (error) {
      console.log(error);
      toast.error("Provided email or password are incorrect");
    } finally {
      dispatch(setLoadingUser(false));
    }
  };

  const logout = async () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const getAllUser = async (page: number) => {
    dispatch(setIsLoadingTable(true));
    try {
      const res = await axios.get(GET_API("", page).GET_ALL_USERS);
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      dispatch(setUsers(res.data.users));
         dispatch(setTotalPage(res.data.totalPage));
         dispatch(setTotalLength(res.data.totalLength));
      dispatch(setIsLoadingTable(false));
   
    } catch (error) {
      console.log(error);
      dispatch(setIsLoadingTable(false));
    }
  };

  const updateUser = async (id: string, data: any) => {
    dispatch(setIsLoadingTable(true));
    try {
      const res = await axios.patch(PATCH_API(id).EDIT_USER, data);
      console.log(res);
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      toast.success("User updated successfully");
      navigate("/account");
      dispatch(setIsLoadingTable(false));
    } catch (error) {
      console.log(error);
      dispatch(setIsLoadingTable(false));
      toast.error("User updated failed");
    }
  };

  const deleteUser = async (id: string) => {
    dispatch(setIsLoadingTable(true));
    try {
      const res = await axios.delete(DELETE_API(id).DELETE_USER);
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      console.log(res);
      toast.success("User deleted successfully");
      navigate("/account");
      getAllUser(1)
      dispatch(setIsLoadingTable(false));
    } catch (error) {
      console.log(error);
      dispatch(setIsLoadingTable(false));
      toast.error("User deleted failed");
    }
  };

  const handleForgotPassword = async (email:string) => {
    try{
      const res = await axios.post(POST_API().FORGOT_PASSWORD, {email})
      console.log(res)
      if(res.status === 200){
        toast.success("Email confirmation was sent to you successfully")
      }

    }catch(error: any){
        console.log(error)
      toast.error(error.response.data.error)
    }
  }

  const handleResetPassword = async (newPassword: string, token: string) => {
      try{
        const res = await axios.post(POST_API("",token).RESET_PASSWORD, {newPassword})

        if(res.status === 200){
          toast.success("Password reset successfully")
          navigate("/login")
        }
      }catch(error:any){
        console.log(error)
        toast.error(error.response.data.error)
      }
  }

  const handleSearchUser = async (keyword: string) => {
    dispatch(setIsLoadingTable(true));
    try {
      const res = await axios.get(`${GET_API("", 1).SEARCH_USERS}&keyword=${keyword}`);
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      dispatch(setUsers(res.data.users));
      dispatch(setTotalPage(res.data.totalPage));
      dispatch(setTotalLength(res.data.totalLength));
      dispatch(setIsLoadingTable(false));
      console.log(res);
    } catch (error) {
      console.log(error);
      dispatch(setIsLoadingTable(false));
    }
  }

   const handleCurrentPage = (page: number) => {
     dispatch(setCurrentPage(page));
   };



  return {
    user,
    isLoading,
    isAuth,
    login,
    logout,
    setUserFromToken,
    getAllUser,
    users,
    isLoadingTable,
    updateUser,
    deleteUser,
    handleForgotPassword,
    handleResetPassword,
    totalPage,
    totalLength,
    handleCurrentPage,
    handleSearchUser
    
  };
}
