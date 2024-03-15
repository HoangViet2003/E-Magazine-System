module.exports = (sequelize, DataTypes) => {
	const Staff = sequelize.define(
		"staff",
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
		},

		{
			timestamps: true, // Automatically manages createdAt and updatedAt
		}
	);

	// Staff.hasMany(sequelize.models.Faculty, {
	// 	foreignKey: "MarketingCoordinatorId",
	// });

	return Staff;
};
