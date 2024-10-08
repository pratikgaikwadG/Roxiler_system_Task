const express = require("express");
const transactioncontroller = require("../controller/transactioncontroller");
const router = express.Router();

router.get("/initializeDatabase", transactioncontroller.initializeDatabase);
router.get("/getAllTransactions", transactioncontroller.getAllTransactions);
router.get("/getStatistics", transactioncontroller.getStatistics)
router.get("/getBarChart",transactioncontroller.getBarChart)
router.get("/getPieChart",transactioncontroller.getPieChart)
module.exports = router;