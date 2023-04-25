const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const baseOption = {
    discriminatorKey : "transactions",
    collection : "transactions",
    timestamps: true,
}
const BaseTransactionSchema = new Schema({
    amount:{type: Number},
    date:{type:Date},
}, baseOption
);

const BaseTransaction = model('BaseTransaction', BaseTransactionSchema);


module.exports = BaseTransaction;
