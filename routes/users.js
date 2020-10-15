const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../models');
const Op = db.Sequelize.Op;

const { registerValidation, loginValidation } = require('../validation');

/* GET users listing. */
router.get('/', async function (req, res, next) {
	const users = await db.user.findAll();
	res.send(users);
});

router.post('/', async (req, res, next) => {
	// console.log('Body: ', req.body);
	const { error } = registerValidation(req.body);
	if (error) return res.status(400).send({ error: `${error.details[0].message}` });

	const { email, password } = req.body;
	try {
		const user = await db.user.findOne({
			where: {
				email: { [Op.eq]: email },
			},
		});

		if (user) throw new Error('User already exists');
		const hashedPassword = await bcrypt.hash(password, 10);
		// const newUser = await db.user.create({ email: email, password: password });
		const newUser = await db.user.create({ email: email, password: hashedPassword });
		res.status(201).send({ user: newUser });
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
	// console.log('User', user);
	// throw new Error('Broken');
	// res.cookie('userId', '743');
	// console.log('Cookies: ', req.cookies);
	// res.send({ message: 'user created' });
});

module.exports = router;
