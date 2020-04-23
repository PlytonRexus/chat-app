const express = require ('express');
const url = require ('url');
const path = require ('path');

const auth = require ('../middleware/auth');
const Message = require ('../models/Message');

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

router.get('/history/:room', auth.auth, async (req, res) => {
    try {
        const history = await Message.find(
            {
                room: req.params.room
            },
            'content sender sentAt',
            {
                sort: {
                    sentAt: 1
                }
            });
        res.status(200).json({history});
    }

    catch (err) {
        console.log(err);
        // The status code should not be 200.
        res.status(200).json({content: 'Some error occured while fetching history'});
    }
});

module.exports = router;