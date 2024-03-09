module.exports = (sequelize, DataTypes) => {
	const Faculty = sequelize.define(
		"faculty",
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
			MarketingCoordinatorId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},

		{
			timestamps: true, // Automatically manages createdAt and updatedAt
		}
	);

	return Contribution;
};
