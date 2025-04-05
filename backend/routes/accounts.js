/**
 * concept of transaction
 * need to use mongoose.Session()
 * if any of the requests fail, revert back to previous state.
 * happen together or nothing happens
 * some of total wallet balance on the platform should remain the same
 *
 */
const express = require("express");
const mongoose = require("mongoose");
const authMiddleware = require("../middlewares/middleware");
const { Accounts, Transactions } = require("../db");
const accountsRouter = express.Router();

accountsRouter.get("/balance", authMiddleware, async (req, res) => {
  try {
    const userAccount = await Accounts.findOne({ userId: req.userId });
    res.status(200).json({ balance: userAccount.balance });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

accountsRouter.post("/addBalance", authMiddleware, async (req, res) => {
  const user = await Accounts.findOne({ userId: req.userId });
  if (!user) {
    res.status(200).json({
      message: "Invalid User. Raise Alarm. Check this.",
    });
  } else {
    try {
      await Accounts.updateOne(
        { userId: req.userId },
        { $inc: { balance: req.body.balance } }
      );
      res
        .status(200)
        .json({ message: "balance increased by " + req.body.balance });
    } catch (err) {
      res.status(500).json({ message: "server error " + err });
    }
  }
});

accountsRouter.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const fromAccountId = req.userId;
    const toAccountId = req.body.to;
    const toBalance = req.body.balance;
    const fromBalanceAccount = await Accounts.findOne({
      userId: fromAccountId,
    }).session(session);
    const fromBalance = fromBalanceAccount.balance;
    if (fromBalance < toBalance) {
      res.status(400).json({ message: "insufficient balance" });
    }

    await Accounts.updateOne(
      { userId: toAccountId },
      { $inc: { balance: toBalance } }
    ).session(session);

    await Accounts.updateOne(
      { userId: fromAccountId },
      { $inc: { balance: -toBalance } }
    ).session(session);

    const transaction = new Transactions({
      toUserId: toAccountId,
      fromUserId: fromAccountId,
      amount: toBalance,
      remarks: fromAccountId + " paid " + toAccountId + " " + toBalance,
    });
    await transaction.save({ session });
    await session.commitTransaction();
    res.status(200).json({ message: "transfer successful" });
  } catch (err) {
    res.status(400).json({ message: "transaction failed " + err });
  } finally {
    await session.endSession();
  }
});

module.exports = accountsRouter;
