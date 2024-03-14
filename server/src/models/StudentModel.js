module.exports = (sequelize, DataTypes) => {
	const Student = sequelize.define(
		"student",
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
		},
		{
			timestamps: true, // Automatically manages createdAt and updatedAt
		}
	);

	// Student.belongsTo(sequelize.models.Faculty, {
	// 	foreignKey: "FacultyId",
	// 	onDelete: "CASCADE", // If a Faculty is deleted, delete all related students
	// });

	// Student.hasMany(sequelize.models.Article, {
	// 	foreignKey: "StudentId",
	// 	onDelete: "CASCADE",
	// });

	return Student;
};
