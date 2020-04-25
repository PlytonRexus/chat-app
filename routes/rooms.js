const express = require ('express');

const auth = require ('../middleware/auth');
const Room = require ('../models/Room');

const router = express.Router();

router.get('/', auth.auth, async (req, res) => {
	res.status(200).json({rooms: req.user.rooms});
});

router.get('/all', async (req, res) => {
    const allRooms = await Room.find({});
    res.status(200).json({allRooms});
})

module.exports = router;