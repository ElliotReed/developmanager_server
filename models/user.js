'use strict';

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		'user',
		{
			id: {
				primaryKey: true,
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{ timestamps: true, tableName: 'user' }
	);

	User.associate = function (models) {};

	return User;
};
