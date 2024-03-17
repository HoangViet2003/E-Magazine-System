const calLengthPage = (lengthField) => {
	const obj = {};
	obj[lengthField] = [
		{
			$count: "totalLength",
		},
		{
			$addFields: {
				totalPage: { $ceil: { $divide: ["$totalLength", 10] } },
			},
		},
	];
	return obj;
};

const paginate = (page) => [{ $skip: (page - 1) * 10 }, { $limit: 10 }];

module.exports = {
	calLengthPage,
	paginate,
};
