const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const baseOption = {
    discriminatorKey : "reminder",
    collection : "reminder",
    timestamps: true,
}
const reminderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
	description:{type:String},
    amount:{type: Number},
    date:{type:Date}
}, baseOption
);

const reminder = model('reminder', reminderSchema);


module.exports = reminder;