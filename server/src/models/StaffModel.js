const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Staff = sequelize.define("Staff", {
	Id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	Name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	Email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	Password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	Role: {
		type: DataTypes.ENUM(
			"Marketing Manager",
			"Marketing Coordinator",
			"Administrator"
		),
		allowNull: false,
	},
	CreatedAt: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
	},
	UpdatedAt: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
	},
});

module.exports = Staff;
