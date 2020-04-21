const express = require('express');
const path = require('path');

const {
	users,
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    addRoom,
    getAllRooms
} = require('../controllers/users');

const router = express.Router();
const originalHTML = path.join(__dirname, '..', 'public', 'original', 'index.html');

router.get('/', (req, res) => {
    res.sendFile(originalHTML);
});

router.post('/', (req, res) => {
	res.status(200).json(addUser(req.body.user));
});

module.exports = router;