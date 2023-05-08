const User = require("../models/User");
// const BaseTransaction = require("../models/Transaction");
const lendingTransaction = require("../models/lendingTransaction");
const expenseTransaction = require("../models/expenseTransaction");
const incomeTransaction = require("../models/incomeTransaction");


const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;

module.exports = {
	lend: async (req, res) => {
		const { amount, to, from, interest, date, dueDate } = req.body;
		
		const uto = await User.findOne({ username: to });
		const ufrom = await User.findOne({ username: from });
		const transactionDoc = await lendingTransaction.create({
			amount,
			to: uto._id,
			from: ufrom._id,
			interest,
			date: new Date(date),
			dueDate: new Date(dueDate),
		});
		var bal1 = 0,
			bal2 = 0;
		User.findById(uto._id, "balance")
			.then(async (docs) => {
			if (docs) {
				bal1 = docs.balance;
				const user1 = await User.findByIdAndUpdate(uto._id, {
				balance: bal1 + parseInt(amount),
				$push: { lendingTransactions: transactionDoc._id },
				});
			}
			})
			.then((err) => {
			console.log(err);
			});
		
		User.findById(ufrom._id, "balance")
			.then(async (docs) => {
			if (docs) {
				bal2 = docs.balance;
				const user2 = await User.findByIdAndUpdate(ufrom._id, {
				balance: bal2 - parseInt(amount),
				$push: { lendingTransactions: transactionDoc._id },
				});
			}
			})
			.then((err) => {
			console.log(err);
			});
		
		res.json(transactionDoc);
	},

	addExpense: async (req, res) => {
		const { token } = req.cookies;
		jwt.verify(token, secret, {}, async (err, info) => {
			if (err) throw err;
			const { amount, to, date, category } = req.body;
			const ufrom = await User.findOne({ username: info.username });
			const transactionDoc = await expenseTransaction.create({
			amount,
			to,
			from: ufrom._id,
			date: new Date(date),
			category,
			});
			User.findById(ufrom._id, "balance")
			.then(async (docs) => {
			if (docs) {
				bal = docs.balance;
				const user2 = await User.findByIdAndUpdate(ufrom._id, {
				balance: bal - parseInt(amount),
				$push: { expenseTransactions: transactionDoc._id },
				});
			}
			})
			.then((err) => {
			console.log(err);
			});
			
			res.json(transactionDoc);
		});
	},

	addIncome: async (req, res) => {
		const { token } = req.cookies;
		jwt.verify(token, secret, {}, async (err, info) => {
			if (err) throw err;
			const { amount, from, date, category } = req.body;
			const uto = await User.findOne({ username: info.username });
			const transactionDoc = await incomeTransaction.create({
			amount,
			to: uto._id,
			from,
			date: new Date(date),
			category,
			});
			User.findById(uto._id, "balance")
			.then(async (docs) => {
			if (docs) {
				bal = docs.balance;
				const user2 = await User.findByIdAndUpdate(uto._id, {
				balance: bal + parseInt(amount),
				$push: { expenseTransactions: transactionDoc._id },
				});
			}
			})
			.then((err) => {
			console.log(err);
			});
			res.json(transactionDoc);
		});
	},

	settleTransaction: async(req, res)=>{
		const { token } = req.cookies;
		jwt.verify(token, secret, {}, async (err, info) => {
			if (err) throw err;
			const trans_id = req.params.id;
			const update_trans = await lendingTransaction.findByIdAndUpdate(trans_id, {
				status: "settled",
			});
			res.json(update_trans);
		});
	}
}