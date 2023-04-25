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
app.post("/login", async (req, res) => {
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
      alert("Invalid");
      res.json("Invalid Credentials");
    }
  } catch (e) {
    console.log(e);
    res.status(404).json(e);
  }
});
app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

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
    const user = await User.findOne({username: info.username});
    const expense_transactions = await expenseTransaction.aggregate([
      {
        $match: { date: { $gt: start, $lte: date_now }, from : user._id },
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
    const user = await User.findOne({username: info.username});
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

app.get("/getCurrentTrend", async (req, res) => {
  res.json("Current Trend");
  // const { token } = req.cookies;
  // jwt.verify(token, secret, {}, async (err, info) => {
  //   if (err) throw err;
  //   const date_now = new Date();
  //   const pst = fns.startOfMonth(date_now);
  //   const o = await Transaction.aggregate([
  //     {
  //       $match: { date: { $gt: pst, $lte: date_now } },
  //     },
  //     {
  //       $group: {
  //         _id: "$category",
  //         amount: { $sum: "$amount" },
  //       },
  //     },
  //   ]);
  //   const o2 = await User.find({ username: info.username }, "balance limit");
  //   const exp = await Transaction.aggregate([
  //     {
  //       $match: { date: { $gt: pst, $lte: date_now }, from: info.username },
  //     },
  //     {
  //       $group: {
  //         _id: null,
  //         amount: { $sum: "$amount" },
  //       },
  //     },
  //   ]);
  //   res.json({ pie_data: o, bal: o2, exp: exp });
  // });
});

app.get("/getMonthly/:id", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const field = req.params.id;
    const date_now = new Date();
    const prev_six = fns.endOfMonth(fns.subMonths(date_now, 7));
    const user = await User.findOne({username: info.username});

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
      const monthly = await expenseTransaction
      .aggregate([
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
      const monthly = await expenseTransaction
      .aggregate([
        {
          $match: {
            date: { $gt: prev_six, $lte: date_now },
            category: field,
            from : user._id,
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
    const user = await User.find({username: info.username});
    const dues = await lendingTransaction.findOne(
      { to: user._id },
      "from dueDate interest amount date"
    );
    res.json(dues);
  });
});

app.get("/getHistory", async (req, res) => {
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if(err) throw err;
    const user = await User.findOne({username : info.username});
    const history = await expenseTransaction
      .aggregate([
        {
          $match: {
            from: user._id,
          },
        },
        {
          $sort: {
            date: 1,
          },
        },
      ]);
    res.json(history);
  });
});


app.listen(port);
