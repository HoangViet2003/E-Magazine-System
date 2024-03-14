module.exports = (sequelize, DataTypes) => {
	const Article = sequelize.define(
		"article",
		{
			Id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			ContributionId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			StudentId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			Content: {
				type: DataTypes.TEXT, // Store as TEXT or VARCHAR
				allowNull: false,
				get() {
					const content = this.getDataValue("Content");
					return content ? JSON.parse(content) : [];
				},
				set(value) {
					this.setDataValue("Content", JSON.stringify(value));
				},
			},
			Type: {
				type: DataTypes.ENUM("word", "image"),
				allowNull: false,
			},
			isSelectedForPublication: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
		},
		{
			timestamps: true, // Automatically manages createdAt and updatedAt
		}
	);

	// Article.belongsTo(sequelize.models.Contribution, {
	// 	foreignKey: "ContributionId",
	// });
	// Article.belongsTo(sequelize.models.Student, { foreignKey: "StudentId" });
	// Article.hasMany(sequelize.models.Comment, { foreignKey: "ArticleId" });

	return Article;
};
