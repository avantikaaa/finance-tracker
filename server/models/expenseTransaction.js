const mongoose = require("mongoose");
const { BaseTransaction, BaseTransactionSchema } = require("./Transaction");
const { Schema, model } = mongoose;

const extendSchema = require('mongoose-extend-schema');

const expenseSchema = new extendSchema(BaseTransactionSchema, {
  from: { type: Schema.Types.ObjectId, ref: "User" },
  to: { type: String },
  dueDate: { type: Date },
  interest: { type: Number },
  category:{type: String}
}, {timestamps:true});

const expenses = model("expenseTransaction", expenseSchema);
module.exports = expenses;
