const cron = require("node-cron")

// set up singleton object
// this object will be used to store all the cron jobs

class CronSingleton {
	constructor() {
		this.cronJobs = {}
	}

	static getInstance() {
		if (!CronSingleton._instance) {
			CronSingleton._instance = new CronSingleton()
		}
		return CronSingleton._instance
	}
}

module.exports = CronSingleton
