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
			StaffId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},

		{
			timestamps: true, // Automatically manages createdAt and updatedAt
		}
	);

	// Faculty.hasMany(sequelize.models.Student, { foreignKey: "FacultyId", onDelete: "CASCADE" });
	// Faculty.belongsTo(sequelize.models.Staff, {
	// 	foreignKey: "MarketingCoordinatorId",
	// });

	return Faculty;
};
