module.exports = (sequelize, DataTypes) => {
	const Student = sequelize.define(
		"student",
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

	return Student;
};
