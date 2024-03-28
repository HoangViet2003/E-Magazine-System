const express = require("express")
// const mongoSanitize = require("express-mongo-sanitize");
// const xss = require("xss-clean");
// const compression = require("compression");
// const helmet = require("helmet");
const cors = require("cors")
const { Server, Socket } = require("socket.io")
// const pinoHttp = require("pino-http");

// const { errorHandler } = require("#middlewares");
const { config, pinocfg, routes, db, eventEmitter } = require("./configs")
const app = express()
const { initSocket } = require("./utils/initSocket")
// const logger = pinoHttp(pinocfg);
const httpServer = require("http").createServer(app)

const io = new Server(httpServer, {
	cors: {
		origin: "*",
	},
})

initSocket(io)

/* ------------------------ cors ------------------------ */
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* --- sanitize mongo queries data (prevent injection) -- */
// app.use(mongoSanitize());

/* ------------ Data sanitization against XSS ----------- */
// app.use(xss());

/* --------------- compress response body --------------- */
// app.use(compression());

/* ----- secure app by setting various HTTP headers ----- */
// app.use(helmet());

// use pino logger
// app.use(logger);

/* ------------------ routes configure ------------------ */
routes(app)

eventEmitter.getInstance().setSocketIO(io)

/* -------------------- error handler ------------------- */
// app.use(errorHandler);

app.get("/", (req, res) => {
	res.send("Hello World")
})

/* ----------- connect database before listen ----------- */
db().then(() =>
	httpServer.listen(config.BASE.PORT, async (err) => {
		if (err) console.log(err)
		console.log(`Server is running at http://${config.HttpUrl}`)
	})
)
