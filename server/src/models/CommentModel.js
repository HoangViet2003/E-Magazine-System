module.exports = (sequelize, DataTypes) => {
	const Commnent = sequelize.define(
		"comment",
		{
			Id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			ArticleId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			StaffId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			Content: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
		},

		{
			timestamps: true, // Automatically manages createdAt and updatedAt
		}
	);

	return Commnent;
};
