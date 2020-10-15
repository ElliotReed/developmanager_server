const router = require('express').Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	console.log('get request');
	res.send({ message: 'response sent' });
});

module.exports = router;
2;
