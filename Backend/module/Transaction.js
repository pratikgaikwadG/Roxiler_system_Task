// models/Transaction.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  id:{
    type:Number,
    required:false
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  dateOfSale: {
    type: Date,
    required: true,
  },
  sold: {
    type: Boolean,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image:{
    type:String,
    required:false
  }
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;