const mongoose = require ('mongoose');
const validator = require ('validator');
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');

var TokenSchema = new mongoose.Schema({
	token: {
		type: String
	}
});

var roomSchema = new mongoose.Schema({
	room: {
		type: String
	}
});

var UserSchema = new mongoose.Schema(
	{
		password:
		{
			type: String,
			validate (value) {
				if (value.length < 6) {throw new Error ("Password should be at least 6 characters long.");}
				if (value.toLowerCase().includes("password")) {throw new Error ("You are using an insecure password.");}
			},
			trim: true
		},
		tokens: [TokenSchema],
		avatar:
		{
			type: Buffer
		},
		rooms:[roomSchema],
		username: {
			type: String,
			unique: true,
			trim: true
		}
	},
	{
		timestamps: true
	}
);

/* UserSchema Pre */
UserSchema.pre("save", async function (next) {
	const user = this;
	if (user.isModified("password")) {
		console.log("Password was modified.");
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

/* UserSchema Methods */
UserSchema.methods.generateJWT = async function () {
	const user = this;
	const token = jwt.sign({ _id: user["_id"] }, "secret", { expiresIn: "4 days" });
	user.tokens = user.tokens.concat({token});
	try {
		await user.save();
		return token;
	}
	catch (err) {
		console.log(err);
	}
}

UserSchema.methods.setTokenCount = async function () {
	const user = this;
	user.tokenCount = user.tokens.length;
	await user.save();
	return user.tokens.length;
}

UserSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();
	delete userObject.password;
	delete userObject.tokens;
	delete userObject.tokenCount;
	delete userObject["__v"];
	delete userObject.avatar;
	delete userObject.format;
	return userObject;
}

module.exports = mongoose.model("User", UserSchema);