const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const accountsRouter = require("./accounts");
const { User } = require("../db/index");

router.use("/user", userRouter);
router.use("/account", accountsRouter);

module.exports = router;
