// socketManager.js

let ioInstance;

const initSocket = (io) => {
	ioInstance = io;

	ioInstance.on("connection", (socket) => {
		socket.on("join", (id) => {
			socket.join(id);
			console.log("User has joined: ", id);
			socket.emit("joined", `You has joined ${id}`);
		});

		socket.on("disconnect", () => {
			console.log("User has left: ", socket.id);
		});
	});
};

const emitNotification = (roomId, message) => {
	if (ioInstance) {
		ioInstance.to(roomId).emit("notification", { message });
	}
};

module.exports = { initSocket, emitNotification };
