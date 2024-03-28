const EventEmitter = require("events")
const { Server } = require("socket.io")

class EmitterSingleton {
	constructor() {
		this.emitter = new EventEmitter()
		this.socketIO = new Server()

		this.emitter.on("detectFileChange", (data) => {
			this.socketIO.emit("detectFileChange", data)
		})
	}

	static getInstance() {
		if (!EmitterSingleton._instance) {
			EmitterSingleton._instance = new EmitterSingleton()
		}
		return EmitterSingleton._instance
	}

	getEmitter() {
		return this.emitter
	}

	setSocketIO(socketIO) {
		this.socketIO = socketIO
	}
}

module.exports = EmitterSingleton
