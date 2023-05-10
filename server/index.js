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


const winston = require('winston');
	
const secret = process.env.SECRET_KEY;
const port = process.env.PORT || 4000;
const fns = require("date-fns");
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());


// Define a logger that logs messages to a file.
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
    new winston.transports.File({ filename: 'logs/warn.log', level: 'warn' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});



mongoose.set("strictQuery", true);
beforeAll = (async () => {
  await mongoose.connect('mongodb://mongodb:27017/mydb', { useNewUrlParser: true, useUnifiedTopology: true })
  // await mongoose.connect('mongodb://localhost:27017/newdb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB', err);
    });
});
beforeAll();
console.log("hi");


var server = app.listen(port, () => {
  console.log("listening on ", port);
});

module.exports = {logger, app, server};

const auth = require("./controllers/auth.js");
const transaction_api = require("./controllers/transaction.js");
const user_actions = require("./controllers/user_actions.js");
const { getMonthly } = require("./controllers/user_actions.js");
const reminders = require("./controllers/reminder.js");



// actions for authentication
app.post("/login", auth.login);
app.post("/logout", auth.logout);
app.post("/register", auth.register);

// functions related to the transactions
app.post("/addLending", transaction_api.lend);
app.post("/addExpense", transaction_api.addExpense);
app.post("/addIncome", transaction_api.addIncome);
app.patch("/settleTransaction/:id", transaction_api.settleTransaction);

// To get information/statistics for the users
app.get("/profile", user_actions.profile);
app.get("/getCurrentLending", user_actions.getCurrentLending);
app.get("/getCurrentExpense", user_actions.getCurrentExpense);
app.get("/getCurrentIncome", user_actions.getCurrentIncome);
app.get("/getMonthly/:id", user_actions.getMonthly);
app.get("/getDues", user_actions.getDues);
app.get("/getHistory", user_actions.getHistory);
app.get("/getBalance", user_actions.getBalance);
app.get("/getFriends", user_actions.getFriends);
app.get("/getUserInfo", user_actions.getUserInfo);
app.patch("/updateInfo", user_actions.updateInfo);

app.post("/addReminder", reminders.addReminder);
app.get("/getReminder", reminders.getReminder);

;
// app.listen(port);