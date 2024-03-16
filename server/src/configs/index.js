const db = require("./db");
const config = require("./config");
// const pinocfg = require("./pinocfg");
const routes = require("./routes");
const eventEmitter = require("./eventEmitter");

module.exports = {
	db,
	config,
	// pinocfg,
	routes,
	eventEmitter,
};
