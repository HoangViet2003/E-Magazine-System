module.exports = (sequelize, DataTypes) => {
	const Guest = sequelize.define(
		"guest",
		{
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
		},

		{
			timestamps: true, // Automatically manages createdAt and updatedAt
		}
	);

	return Guest;
};
