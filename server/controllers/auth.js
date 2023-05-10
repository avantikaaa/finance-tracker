const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;
const salt = bcrypt.genSaltSync(10);
const index = require("../index");

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
			index.logger.info('Successful Login');
			} else {
				index.logger.warn('Invalid credentials');
				res.status(401).json({message: "invalid credentials"});
			}
		} catch (e) {
			console.log(e);
			res.status(400).json(e);
			index.logger.error('Username doesn\'t exist');
		}
	},

	logout: async(req, res) => {
		index.logger.info('Successful Logout');
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
		// console.log(all_usernames);
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
				index.logger.info('User created successfully');
				res.json({ requestData: { username, password } });
			} catch (e) {
				console.log(e);
				index.logger.error('Unkown Error');
				res.status(409).json(e);
			}
		}
		else{
			index.logger.warn('Create user aborted: Username already in use');
			res.status(409).json({message: "username in use"});
		}
	}
}