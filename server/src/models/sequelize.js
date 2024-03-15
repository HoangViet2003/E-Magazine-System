const { Sequelize, DataTypes } = require("sequelize");
const config = require("../configs/config");

const sequelize = new Sequelize(
	config.DB.DATABASE,
	config.DB.USER,
	config.DB.PASSWORD,
	{
		host: config.DB.MYSQL_URL,
		dialect: config.DB.DIALECT,

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
dbSequelize.staff = require("./StaffModel.js")(sequelize, DataTypes);
dbSequelize.faculty = require("./FacultyModel.js")(sequelize, DataTypes);
dbSequelize.guest = require("./GuestModel.js")(sequelize, DataTypes);
dbSequelize.comment = require("./CommentModel.js")(sequelize, DataTypes);
dbSequelize.article = require("./ArticleModel.js")(sequelize, DataTypes);
dbSequelize.contribution = require("./ContributionModel.js")(sequelize, DataTypes);

dbSequelize.students.belongsTo(dbSequelize.faculty, {
	foreignKey: "FacultyId",
});


dbSequelize.students.hasMany(dbSequelize.article, {
	foreignKey: "StudentId",
	onDelete: "CASCADE",
});

dbSequelize.staff.hasMany(dbSequelize.faculty, {
	foreignKey: "MarketingCoordinatorId",
});

dbSequelize.guest.belongsTo(dbSequelize.faculty, { foreignKey: "FacultyId" });

dbSequelize.faculty.hasMany(dbSequelize.students, {
	foreignKey: "FacultyId",
	onDelete: "CASCADE",
});
dbSequelize.faculty.belongsTo(dbSequelize.staff, {
	foreignKey: "MarketingCoordinatorId",
});

dbSequelize.contribution.hasMany(dbSequelize.article, {
	foreignKey: "ContributionId",
});

dbSequelize.contribution.belongsTo(dbSequelize.faculty, {
	foreignKey: "FacultyId",

});

dbSequelize.contribution.belongsTo(dbSequelize.students, {
	foreignKey: "StudentId",
});

dbSequelize.article.belongsTo(dbSequelize.contribution, {
	foreignKey: "ContributionId",
});
dbSequelize.article.belongsTo(dbSequelize.students, {
	foreignKey: "StudentId",
});
dbSequelize.article.hasMany(dbSequelize.comment, { foreignKey: "ArticleId" });

dbSequelize.comment.belongsTo(dbSequelize.article, { foreignKey: "ArticleId" });
dbSequelize.comment.belongsTo(dbSequelize.staff, { foreignKey: "StaffId" });


dbSequelize.sequelize.sync({ force:false}).then(() => {
	console.log("Drop and re-sync db.");
});

module.exports = dbSequelize;
