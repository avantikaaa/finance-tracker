require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const User = require("./models/User");
const BaseTransaction = require("./models/Transaction");
const lendingTransaction = require("./models/lendingTransaction");
const expenseTransaction = require("./models/expenseTransaction");
const incomeTransaction = require("./models/incomeTransaction");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;
const port = process.env.PORT || 4000;
const fns = require("date-fns");
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
mongoose.set("strictQuery", true);
mongoose.connect(process.env.CONNECTION_STRING);
// , () => {
//   console.log("Connected to MongoDB");
// });
const auth = require("./controllers/auth.js");

app.post("/login", auth.login);
app.post("/logout", auth.logout);
// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const UserDoc = await User.findOne({ username });
//     const passOk = bcrypt.compareSync(password, UserDoc.password);
//     if (passOk) {
//       jwt.sign({ username, id: UserDoc._id }, secret, {}, (err, token) => {
//         if (err) throw err;
//         res.cookie("token", token).json({
//           id: UserDoc._id,
//           username,
//         });
//       });
//     } else {
//       res.json("Invalid Credentials");
//     }
//   } catch (e) {
//     console.log(e);
//     res.status(404).json(e);
//   }
// });
// app.post("/logout", (req, res) => {
//   res.cookie("token", "").json("ok");
// });

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post("/register", async (req, res) => {
  const { username, password, name, college, yearOfStudy, limit } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
      name,
      college,
      yearOfStudy: yearOfStudy,
      limit: limit,
    });
    res.json({ requestData: { username, password } });
  } catch (e) {
    console.log(e);
    res.status(404).json(e);
  }
});

app.post("/addLending", async (req, res) => {
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
});

app.post("/addExpense", async (req, res) => {
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
    const upd = await User.findByIdAndUpdate(ufrom._id, {
      $push: { expenseTransactions: transactionDoc._id },
    });
    res.json(transactionDoc);
  });
});

app.post("/addIncome", async (req, res) => {
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
    const upd = await User.findByIdAndUpdate(uto._id, {
      $push: { incomeTransactions: transactionDoc._id },
    });
    res.json(transactionDoc);
  });
});

app.get("/getCurrentLending", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const date_now = new Date();
    const start = fns.startOfMonth(date_now);
    const user = await User.findOne({ username: info.username });
    const lend_transactions = await lendingTransaction.aggregate([
      {
        $match: {
          date: { $gt: start, $lte: date_now },
          $or: [{ to: user._id }, { from: user._id }],
        },
      },
    ]);
    res.json(lend_transactions);
  });
});

app.get("/getCurrentExpense", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const date_now = new Date();
    const start = fns.startOfMonth(date_now);
    const user = await User.findOne({ username: info.username });
    const expense_transactions = await expenseTransaction.aggregate([
      {
        $match: { date: { $gt: start, $lte: date_now }, from: user._id },
      },
      {
        $group: {
          _id: "$category",
          amount: { $sum: "$amount" },
        },
      },
    ]);
    res.json(expense_transactions);
  });
});

app.get("/getCurrentIncome", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const date_now = new Date();
    const start = fns.startOfMonth(date_now);
    const user = await User.findOne({ username: info.username });
    const income_transactions = await incomeTransaction.aggregate([
      {
        $match: { date: { $gt: start, $lte: date_now }, to: user._id },
      },
      {
        $group: {
          _id: "$category",
          amount: { $sum: "$amount" },
        },
      },
    ]);
    res.json(income_transactions);
  });
});

app.get("/getMonthly/:id", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const field = req.params.id;
    const date_now = new Date();
    const prev_six = fns.endOfMonth(fns.subMonths(date_now, 7));
    const user = await User.findOne({ username: info.username });

    if (field === "Peer-Lending") {
      const monthly = await lendingTransaction.aggregate([
        {
          $match: {
            date: { $gt: prev_six, $lte: date_now },
            $or: [{ to: user._id }, { from: user._id }],
          },
        },
        {
          $group: {
            _id: { $month: "$date" },
            amount: { $sum: "$amount" },
          },
        },
      ]);
      res.json(monthly);
    } else if (field === "Total") {
      const monthly = await expenseTransaction.aggregate([
        {
          $match: {
            date: { $gt: prev_six, $lte: date_now },
            from: user._id,
          },
        },
        {
          $group: {
            _id: { $month: "$date" },
            amount: { $sum: "$amount" },
          },
        },
      ]);
      res.json(monthly);
    } else {
      const monthly = await expenseTransaction.aggregate([
        {
          $match: {
            date: { $gt: prev_six, $lte: date_now },
            category: field,
            from: user._id,
          },
        },
        {
          $group: {
            _id: { $month: "$date" },
            amount: { $sum: "$amount" },
          },
        },
      ]);
      res.json(monthly);
    }
  });
});

app.get("/getDues", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const user = await User.find({ username: info.username });
    const date_now = new Date();
    const month_end = fns.endOfMonth(new Date(2023, 5, 24));
    const dues = await lendingTransaction.aggregate([
      {
        $match: {
          to: user._id,
          dueDate: {$gt : date_now, $lte: month_end}
        },
      },
      // {
      //   $sort: {
      //     dueDate: 1,
      //   },
      // },
    ]);
    res.json(dues);
  });
});

app.get("/getHistory", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const user = await User.findOne({ username: info.username });
    const history = await expenseTransaction.aggregate([
      {
        $match: {
          from: user._id,
        },
      },
      {
        $sort: {
          date: -1,
        },
      },
    ]);
    res.json(history);
  });
});

app.get("/getBalance", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const user = await User.findOne({ username: info.username });
    const date_now = new Date();
    const start = fns.startOfMonth(date_now);
    const LendingDeb = await lendingTransaction.aggregate([
      {
        $match: { to: user._id, dueDate: { $gt: start, $lte: date_now } },
      },
      {
        $group: { _id: null, amount: { $sum: "$amount" } },
      },
    ]);
    const LendingCred = await lendingTransaction.aggregate([
      {
        $match: { from: user._id, dueDate: { $gt: start, $lte: date_now } },
      },
      {
        $group: { _id: null, amount: { $sum: "$amount" } },
      },
    ]);
    const cred = await incomeTransaction.aggregate([
      {
        $match: { to: user._id, date: { $gt: start, $lte: date_now } },
      },
      {
        $group: { _id: null, amount: { $sum: "$amount" } },
      },
    ]);
    const debit = await expenseTransaction.aggregate([
      {
        $match: { from: user._id, date: { $gt: start, $lte: date_now } },
      },
      {
        $group: { _id: null, amount: { $sum: "$amount" } },
      },
    ]);
    const mExp =
      parseInt(LendingCred.length > 0 ? LendingCred[0].amount : 0) +
      parseInt(cred.length ? cred[0].amount : 0) -
      parseInt(debit.length ? debit[0].amount : 0) -
      parseInt(LendingDeb.length ? LendingDeb[0].amount : 0);

      const cred_tot =  parseInt(LendingCred.length > 0 ? LendingCred[0].amount : 0) + parseInt(cred.length ? cred[0].amount : 0);
      const deb_tot =  parseInt(LendingDeb.length > 0 ? LendingDeb[0].amount : 0) + parseInt(debit.length ? debit[0].amount : 0);

    res.json({ balance: user.balance, monthExpense: mExp, limit: user.limit, totalCred: cred_tot, totalDebit : deb_tot});
  });
});

app.get("/getFriends", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const user = await User.findOne({ username: info.username }).populate({
      path: "lendingTransactions",
      populate: {
        path: "to from",
      },
      select: ["to", "from", "amount"],
    });
    const friend_lended_to = [];
    const friend_borrowed_from = [];
    user.lendingTransactions.map((trans) => {
      if (trans.from.username == info.username) {
        const to = trans.to.username;
        const amt = trans.amount;
        friend_lended_to.push({ username: to, amount: amt });
      } else {
        const from = trans.from.username;
        const amt = trans.amount;
        friend_borrowed_from.push({ username: from, amount: -amt });
      }
    });
    res.json({
      lended_to: friend_lended_to,
      borrowed_from: friend_borrowed_from,
    });
  });
});

app.listen(port);
