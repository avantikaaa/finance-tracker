const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;

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
			} else {
			res.json("Invalid Credentials");
			}
		} catch (e) {
			console.log(e);
			res.status(404).json(e);
		}
	},

	logout: async(req, res) => {
		res.cookie("token", "").json("ok");
	}
}


// async function login(res, req){
// 	const { username, password } = req.body;
// 	try {
// 		const UserDoc = await User.findOne({ username });
// 		const passOk = bcrypt.compareSync(password, UserDoc.password);
// 		if (passOk) {
// 		jwt.sign({ username, id: UserDoc._id }, secret, {}, (err, token) => {
// 			if (err) throw err;
// 			res.cookie("token", token).json({
// 			id: UserDoc._id,
// 			username,
// 			});
// 		});
// 		} else {
// 		alert("Invalid");
// 		res.json("Invalid Credentials");
// 		}
// 	} catch (e) {
// 		console.log(e);
// 		res.status(404).json(e);
// 	}
// }

// let logout =  async(req, res) => {
// 	res.cookie("token", "").json("ok");
// }