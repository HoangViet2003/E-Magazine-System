// socketManager.js

let ioInstance

const initSocket = (io) => {
	ioInstance = io

	ioInstance.on("connection", (socket) => {
		socket.on("join", (id) => {
			socket.join(id)
			socket.emit("joined", `You has joined ${id}`)
		})

		socket.on("disconnect", () => {})
	})
}

const emitNotification = (roomId, message) => {
	if (ioInstance) {
		ioInstance.to(roomId).emit("notification", { message })
	}
}

module.exports = { initSocket, emitNotification }
