import { Link } from "react-router-dom";

import SearchArticle from "./SearchArticle";

import Logo from "../../assets/Logo.png";
import HeaderMenu from "./HeaderMenu";
import UserAvatar from "./UserAvatar";
import io from "socket.io-client";
import { useEffect } from "react";
import useSocket from './../../redux/hooks/useSocket';
import { useAuth } from "./../../redux/hooks/useAuth";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNotifications } from "../../redux/hooks/useNotification";


const Header = () => {
  const { user } = useAuth();
  const { disconnectSocket } = useSocket();
  const {handleReadNotification} = useNotifications()
  const ENDPOINT = "https://e-magazine-system-g8xo.onrender.com"

  useEffect(() => {
    const socket = io(ENDPOINT);

    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("join", user._id);

      setTimeout(() => {
        socket.on("notification", (data) => {
          toast.info(data.message);
          handleReadNotification(true)
        });
      }, 3000);
    });

    return () => {
      disconnectSocket();
    };
  }, []);


  return (
    <div className="my-4 border-b border-borderColor">
      <header className="container my-4 flex items-center justify-between gap-5 xl:gap-8">
        <Link to="/" className="hidden xl:inline-block">
          <div className=" flex w-[288px] items-center gap-3">
            <img src={Logo} alt="Logo" className="inline" />
            <h5 className="text-nowrap text-lg font-semibold text-logoText">
              E-Magazine System
            </h5>
          </div>
        </Link>
        <SearchArticle />
        <HeaderMenu />
        <UserAvatar />
      </header>
    </div>
  );
};

export default Header;
