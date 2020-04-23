const jwt = require ('jsonwebtoken');
const User = require ('../models/User');

exports.auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization || req.headers["Authorization"].replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({_id: decoded._id, "tokens.token": token});

        if (!user) {
            throw new Error();
        }
        
        req.user = user;
        req.utils = token;
        next();
    }
    catch (err) {
        console.log (err);
        res.status(400).json({"message": "Some auth error occured."});
    }
}