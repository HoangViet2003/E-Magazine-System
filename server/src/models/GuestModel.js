const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Guest = sequelize.define("Guest", {
	Id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	FacultyId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	Username: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	Password: {
		type: DataTypes.STRING,
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

module.exports = Guest;
