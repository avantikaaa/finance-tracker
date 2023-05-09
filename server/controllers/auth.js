const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;
const salt = bcrypt.genSaltSync(10);
const logger = require("../index");

module.exports = {
	login: async(req, res) => {
		const { username, password } = req.body;
		try {
			const UserDoc = await User.findOne({ username });
			const passOk = bcrypt.compareSync(password, UserDoc.password);
			if (passOk) {
			jwt.sign({ username, id: UserDoc._id }, secret, {}, (err, token) => {
				if (err) throw err;
				res.cookie("token", token).json({
				id: UserDoc._id,
				username,
				});
			});
			logger.info('Successful Login');
			} else {
				logger.warn('Invalid credentials');
				res.status(401).json({});
			}
		} catch (e) {
			console.log(e);
			res.status(404).json(e);
			logger.error('Something went wrong');
		}
	},

	logout: async(req, res) => {
		logger.info('Successful Logout');
		res.cookie("token", "").json("ok");
	},

	register: async (req, res) => {
		const { username, password, name, limit } = req.body;
		const all_usernames = await User.aggregate([
			{
				$match:{
					username: username
				}
			}
		]);
		console.log(all_usernames);
		if(all_usernames.length == 0){
			try {
				const userDoc = await User.create({
				username,
				password: bcrypt.hashSync(password, salt),
				name,
				// college,
				// yearOfStudy: yearOfStudy,
				limit: limit,
				});
				logger.info('User created successfully');
				res.json({ requestData: { username, password } });
			} catch (e) {
				console.log(e);
				logger.error('Unkown Error');
				res.status(404).json(e);
			}
		}
		else{
			logger.warn('Create user aborted: Username already in use');
			res.status(409).json({});
		}
	}
}