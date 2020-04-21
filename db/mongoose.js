const mongoose = require('mongoose');

const dbHost = "mongodb://127.0.01:27017/";
const dbName = "tasks-app-api";
const dbUrlDev = dbHost + dbName;
const dbUrl = process.env.MONGODB_URL || dbUrlDev;

mongoose.connect(dbUrl,
{
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false
});

module.exports = mongoose;