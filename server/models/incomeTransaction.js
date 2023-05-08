const mongoose = require("mongoose");
const { BaseTransaction, BaseTransactionSchema } = require("./Transaction");
const { Schema, model } = mongoose;

const extendSchema = require('mongoose-extend-schema');

const incomeSchema = new extendSchema(BaseTransactionSchema, {
  from: { type: String },
  to: { type: Schema.Types.ObjectId, ref: "User", required: true },
  dueDate: { type: Date },
  interest: { type: Number },
  category: {type: String},
}, {timestamps:true});

const income = model("incomeTransaction", incomeSchema);
module.exports = income;
