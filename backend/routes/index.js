const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const { User } = require("../db/index");

router.use("/user", userRouter);

module.exports = router;
