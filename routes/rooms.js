const express = require ('express');

const auth = require ('../middleware/auth');

const router = express.Router();

router.get('/', auth.auth, async (req, res) => {
	res.status(200).json({rooms: req.user.rooms});
});

module.exports = router;