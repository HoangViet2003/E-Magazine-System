const { Sequelize, DataTypes } = require("sequelize");
const config = require("../configs/config");

const sequelize = new Sequelize(
	config.DB.DATABASE,
	config.DB.USER,
	config.DB.PASSWORD,
	{
		host: "localhost",
		dialect: config.DB.DIALECT,
		operatorsAliases: false,

		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},
	}
);

sequelize
	.authenticate()
	.then(() => {
		console.log("Connection has been established successfully.");
	})
	.catch((err) => {
		console.error("Unable to connect to the database:", err);
	});

const dbSequelize = {};
dbSequelize.Sequelize = Sequelize;
dbSequelize.sequelize = sequelize;

dbSequelize.students = require("./StudentModel.js")(sequelize, DataTypes);

dbSequelize.contributions = require('./ContributionModel.js')(sequelize, DataTypes); 

// dbSequelize.faculty = require('./FalcultyModel.js')(sequelize, DataTypes);

// dbSequelize.staffs = require('./StaffModel.js')(sequelize, DataTypes); 

dbSequelize.sequelize.sync({ force: false }).then(() => {
	console.log("Drop and re-sync db.");
});

module.exports = dbSequelize;
