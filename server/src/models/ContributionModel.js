module.exports = (sequelize, DataTypes) => {
	const Contribution = sequelize.define(
		"contribution",
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
			Title: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			UploadDate: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			Status: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			AcademicYear: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			ClosureDate: {
				type: DataTypes.DATE,
				allowNull: false,
			},
		},

		{
			timestamps: true, // Automatically manages createdAt and updatedAt
		}
	);

	// Contribution.hasMany(sequelize.models.Article, {
	// 	foreignKey: "ContributionId",
	// });

	return Contribution;
};
