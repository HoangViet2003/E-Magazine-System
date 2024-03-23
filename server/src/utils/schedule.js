const { cron } = require("../configs");
const moment = require("moment");

const scheduledJobs = {}; // Object to store scheduled job references

const scheduleReminder = (articleId, submissionTime, coordinatorId) => {
	try {
		const hourOfDay = 10;
		const minute = 0;

		const now = moment();
		const daysDifference = moment(submissionTime).diff(now, "days");

		const isCommentChecked = (articleId) => {
			// Replace this with your logic to check if comments are made
			return true;
		};

		// If days different is less than or equal to 14, schedule the reminder
		if (daysDifference <= 14) {
			scheduledJobs[articleId] = cron.schedule(
				`${minute} ${hourOfDay} */${daysDifference} * *`,
				async () => {
					if (isCommentChecked(articleId)) {
						console.log("Reminder scheduled");
					} else {
						// If comments are made, cancel this specific scheduled job
						scheduledJobs[articleId].stop();
						delete scheduledJobs[articleId]; // Remove reference from the object
					}
				}
			);
		}
	} catch (error) {
		console.error("Error in scheduleReminder", error);
	}
};

module.exports = { scheduleReminder };
