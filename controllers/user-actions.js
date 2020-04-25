const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');
const sharp = require ('sharp');

const User = require('../models/User');

const userExists = async (req, res) => {
	var user_exists;

	try {
		const users = await User.find({username: req.body.user.username});

		if (users.length > 0) {
			user_exists = true; // Username already exists.

			console.log('users.length > 0', user_exists);

			return user_exists;
		}
		else {
			user_exists = false;
			console.log('users.length <= 0', user_exists);
			return user_exists;
		}
	}
	catch (err) {
		console.log(err);
	}
}

exports.getAll = async (req, res) => {
	try {
		const users = await User.find({});
		res.status(200).json({"count": users.length, "users": users});
	}
	catch (error) {
		res.status(500).json(error);
	}
}

exports.getById = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if(user.length < 1) return res.status(404).json("No such user exists!");
		res.status(200).json(user);
	}

	catch (error) {
		if (error.name == "CastError") {return res.status(400).json({"error": "Invalid ID"});}
		res.status(500).json(error);
	}
}

exports.createUser = async (req, res, next) => {
	var does_user_exist = await userExists(req, res);
	if (does_user_exist == true) {
		next();
	}
	else {
		var newUser = new User (req.body.user);
		newUser.rooms.push({room: req.body.room});
		try {
			await newUser.save();
			var savedUser = await User.findOne({username: newUser.username});
			const token = await generateJWT(savedUser, req.body.room);
			
			res.status(200).json({
				"message": "Created User Successfully!",
				"createdUser": newUser,
				token,
				newroom: req.body.room
			});
		}
		catch (error) {
			console.log('Reached catch function of createUser.');
			res.status(200).json(error);
		}
	}
}

exports.deleteUser = async (req, res) => {
	try {
		const user = req.user;
		const uresult = await User.findByIdAndDelete(user["_id"]);
		if (tresult == null || uresult == null) {
			return res.status(404).json({"error": "There's something wrong with your request!"});
		}
		res.status(200).json({"message": "Deleted Successfully!", "result": result});
	}
	catch (error) {
		if (error.name == "CastError") {return res.status(400).json({"error": "Invalid ID"});}
		res.status(500).json({"error": error});
	}
}

exports.updateById = async (req, res) => {
	var body = req.body.user;
	const propertiesOnRequest = Object.keys(body);
	const allowedProperties = ["rooms", "username", "password"];
	var invalidUpdates = [];

	propertiesOnRequest.forEach((value) => {
		if (allowedProperties.indexOf(value) == -1) {
			invalidUpdates.push(value);
			delete body[value];
		}
	});

	const validProperties = Object.keys(body);

	try {
		const user = await User.findById(req.params.id);

		if (!user) return res.status(404).json({"message": "User Not Found!"});

		validProperties.forEach((prop) => user[prop] = body[prop]);

		// const user = await User.findByIdAndUpdate(req.params.id, body, {
		// 	new: true,
		// 	runValidators: true
		// });

		await user.save();
		console.log(invalidUpates.join(", "));
		res.status(200).json({message: invalidUpates.join(", ") + " cannot be updated.", "user": user});
	}
	catch (error) {
		res.status(500).json(error);
	}
}

exports.updateByName = async (req, res) => {
	var body = req.body.user;
	const propertiesOnRequest = Object.keys(body);
	const allowedProperties = ["rooms", "username", "password"];
	var invalidUpdates = [];

	propertiesOnRequest.forEach((value) => {
		if (allowedProperties.indexOf(value) == -1) {
			invalidUpdates.push(value);
			delete body[value];
		}
	});

	try {
		const user = await User.findOneAndUpdate({name: req.params.name}, body, {
			new: true,
			runValidators: true
		});
		if (!user) {return res.status(404).json({"message": "User Not Found!"});}
		res.status(200).json({message: invalidUpates.join(", ") + " cannot be updated.", user: user});

	}
	catch (error) {
		res.status(500).json(error);
	}
}

async function checkCred (username, password) {
	const users = await User.find({username: username});
	if (users.length < 1) {return {match: false};}
	console.log(users[0]);

	const match = await bcrypt.compare(password, users[0].password);

	console.log(match);

	var cred = {
		match,
		user: users[0]
	}

	return cred;
}

const checkRoomAndCred = async (username, password, req) => {
	const users = await User.find({username: username});
	if (users.length < 1) {return {match: false};}
	console.log(users[0]);

	const match = await bcrypt.compare(password, users[0].password);

	if (match) {
		const index = users[0].rooms.findIndex((val, ind, arr) => {
			return val.room == req.body.room;
		});
		if (index == -1) {
			users[0].rooms.push({room: req.body.room});
			await users[0].save();
		}
	}

	console.log(match);

	var cred = {
		match,
		user: users[0]
	}

	return cred;
}

async function generateJWT (user, room) {
	var token = await jwt.sign(
		{
			_id: user["_id"],
			username: user.username,
			room: room
		},
		process.env.JWT_SECRET,
		{
			expiresIn: "4 days"
		});
	user.tokens = user.tokens.concat({token});
	await user.save();
	return token;
}

// const signin = async (req, res) => {
// 	console.log('Reached signin function()');
// 	res.json({'message': 'dummy_response_8'});
// 	const cred = await checkRoomAndCred(req.body.user.username, req.body.user.password, req);
// 	console.log (cred.user);
// 	if (cred.match) {
// 		console.log("Auth Passed!");
// 		const token = await generateJWT(cred.user, req.body.room);
// 		// const token = await cred.user.generateJWT();
// 		res.status(200).json({
// 			"message": "Success!",
// 			token,
// 			newroom: req.body.room
// 		});
// 	}
// 	else {
// 		res.status(400).json({"message": "Auth not passed!"});
// 	}
// }

exports.signin = async (req, res) => {
	const cred = await checkRoomAndCred(req.body.user.username, req.body.user.password, req);
	// console.log (cred.user);
	if (cred.match) {
		console.log("Auth Passed!");
		// const token = await generateJWT(cred.user);
		const token = await generateJWT(cred.user, req.body.room);
		res.status(200).json({
			"message": "Success!",
			token,
			newroom: req.body.room
		});
	}
	else {
		res.status(400).json({"message": "Auth not passed!"});
	}
}

exports.getProfile = async (req, res) => {
	try {
		const user = req.user;
		if(user.length < 1) return res.status(404).json("No such user exists!");
		res.status(200).json(user);
	}

	catch (error) {
		if (error.name == "CastError") {return res.status(400).json({"error": "Invalid ID"});}
		res.status(500).json(error);
	}
}

exports.signout = async (req, res) => {
	const user = req.user;
	const token = req.headers.authorization || req.headers["Authorization"].replace('Bearer ', '');
	try {
		const index = user.tokens.indexOf(token);
		user.tokens.splice(index, 1);
		user.tokenCount = user.tokens.length;
		await user.save();
		res.status(200).json({"message": "Logged Out Successfully!"});
	}
	catch (err) {
		console.log(err);
		res.status(400).json({error});
	}
}

function getFileDest(newFileDestination, req) {
	newFileDestination = newFileDestination.substring(1, newFileDestination.length - 1);
	newFileDestination += "/";
	newFileDestination += req.file.filename.toString();
	return newFileDestination;
}

async function sharpValidation (original, mimetype) {
	const buffer = original;
	if (mimetype == "image/png")
	{
		buffer = await sharp(original)
		.resize({
			width: 500,
			height: 500
		})
		.png()
		.toBuffer();
	}

	if (mimetype == "image/jpg") {
		buffer = await sharp(original)
		.resize({
			width: 500,
			height: 500
		})
		.jpg()
		.toBuffer();
	}

	if (mimetype == "image/tiff") {
		buffer = await sharp(original)
		.resize({
			width: 500,
			height: 500
		})
		.tiff()
		.toBuffer();
	}

	if (mimetype == "image/bmp") {
		buffer = await sharp(original)
		.resize({
			width: 500,
			height: 500
		})
		.bmp()
		.toBuffer();
	}

	return buffer;
}

exports.uploadAvatar = async (req, res) => {
	const user = req.user;
	if (!req.file) {
		return res.status(400).json({"error": "No file selected!"});
	}
	else {
		user.avatar = await sharpValidation(req.file.buffer, req.file.mimetype);
		user.format = req.file.mimetype;
		await user.save();
		res.status(201).json({"message": "File uploaded!"});
	}
}

exports.uploadErrors = (err, req, res, next) => {
	res.status(500).json({error: err.message});
}

exports.getAvatar = (req, res) => {
	const user = req.user;
	try {
		if (!user || !user.avatar) {
			throw new Error();
		}
		res.set('Content-Type', user.format);
		res.send(user.avatar);
	}
	catch (err) {
		res.status(500).json({"error": err});
	}
}

exports.publicAvatar = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user || !user.avatar) {
		throw new Error();
		}
		res.set('Content-Type', 'image/png');
		res.send(user.avatar);
	}
	catch (e) {
		res.status(404).send();
	}
}

async function getSavable (msgObject) {
    var savable = new Object;
    msgObject.image = await sharpValidation(msgObject.image.buffer, msgObject.image.mimetype);
    savable['sender'] = msgObject.username;
    savable['sentAt'] = msgObject.timestamp;
    savable['content'] = msgObject.msg;
    savable['room'] = msgObject.inRoom;
    savable['image'] = msgObject.image;
    savable['format'] = msgObject.image.mimetype;
    return savable;
}

exports.uploadMessage = async (req, res) => {
	var msgObject = req.body.msgObject;
	console.log(msgObject);
	var savable = getSavable(msgObject);
	var newMessage = new Message (savable);
    await newMessage.save();
	res.status(201).json({"message": "File uploaded!"});
}