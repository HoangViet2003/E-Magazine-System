module.exports = (sequelize, DataTypes) => {
	const Guest = sequelize.define(
		"guest",
		{
			Id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			Name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			Email:{
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			Password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},

		{
			timestamps: true, // Automatically manages createdAt and updatedAt
		}
	);

	// Guest.belongsTo(sequelize.models.Faculty, { foreignKey: "FacultyId" });

	return Guest;
};
