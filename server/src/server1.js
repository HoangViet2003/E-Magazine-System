const mongoose = require("mongoose");
const Document = require("./models/Document");

mongoose.connect("mongodb+srv://tuananhngo2513:Kizosaco123@cluster0.lrvvcyn.mongodb.net/magazine");

const io = require("socket.io")(3001, {
	cors: {
		origin: "http://localhost:5173",
		method: ["GET", "POST"],
	},
});

const defaultValue = "";

io.on("connection", (socket) => {
	socket.on("get-document", async (documentId) => {
		const document = await findOrCreateDocument(documentId);

		socket.join(documentId);
		socket.emit("load-document", document.data);

		socket.on("send-changes", (delta) => {
			socket.broadcast.to(documentId).emit("receive-changes", delta);
		});

		socket.on("save-document", async (data) => {
			await Document.findByIdAndUpdate(documentId, { data });
		});
	});
});

async function findOrCreateDocument(id) {
	if (id == null) return;

	const document = await Document.findById(id);
	if (document) return document;

	return await Document.create({ _id: id, data: defaultValue });
}
