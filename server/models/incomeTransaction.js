const mongoose = require("mongoose");
const { BaseTransaction } = require("./Transaction");
const { Schema, model } = mongoose;

const incomeSchema = new Schema({
  from: { type: String },
  to: { type: Schema.Types.ObjectId, ref: "User", required: true },
  dueDate: { type: Date },
  interest: { type: Number },
  amount:{type: Number},
  date:{type:Date},
  category: {type: String},
}, {timestamps:true});

const income = model("incomeTransaction", incomeSchema);
module.exports = income;
