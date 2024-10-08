const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userrouter = require("./router/userrouter")
const transactionrouter = require("./router/transactionrouter")

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/transaction_data");

const database = mongoose.connection;
database.on("error",(error)=>{
    console.log("Error",error);
});

database.once("connected",()=>{
    console.log("database is connected");
});


app.use("/api/chart",userrouter);
app.use("/api/transaction", transactionrouter);



app.use("/uploads", express.static("uploads"));
app.listen(5001,()=>{
    console.log("http://localhost:5001");
});