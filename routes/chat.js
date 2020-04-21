const express = require ('express');
const url = require ('url');
const path = require ('path');

const auth = require ('../middleware/auth');

const router = express.Router();

const paramsToHeaders = (req, res, next) => {
	req.headers.authorization = req.params.token;
	next();
}

router.get('/', auth.auth, (req, res) => {
	res.json({
		url: req.url.href + '/' + req.utils.token,
		token: req.utils.token
	});
});

router.get('/:token', paramsToHeaders, auth.auth, (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'public', 'original', 'chat', 'index.html'));
});

module.exports = router;