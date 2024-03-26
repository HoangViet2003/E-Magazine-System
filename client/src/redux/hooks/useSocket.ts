import io from "socket.io-client";
// // const socket = io('171.236.226.14:4009')
// const ENDPOINT = "https://d9br4l58fpq2r.cloudfront.net";
const ENDPOINT = "http://localhost:8080";

export default function useSocket() {
  let socket: any;

  const initiateSocket = (roomId: any) => {
    socket = io(ENDPOINT);
    console.log(`Connecting socket...`);
    if (socket && roomId) socket.emit("join", roomId);
  };

  const disconnectSocket = () => {
    console.log("Disconnecting socket...");
    if (socket) socket.disconnect();
  };

  const subscribeToNotifications = (id:any) => {
    if (!socket) return true;
    socket.on(`notification`, (msg: any) => {
      console.log("Websocket event sendNotification received!", msg);
    });
  };

  return {
    initiateSocket,
    disconnectSocket,
    subscribeToNotifications,
  };
}
