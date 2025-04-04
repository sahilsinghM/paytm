const express = require("express");
const authMiddleware = require("../middlewares/middleware");
const { Accounts } = require("../db");
const accountsRouter = express.Router();

accountsRouter.get("/balance", authMiddleware, async (req, res) => {
  try {
    const userAccount = await Accounts.findOne({ userId: req.userId });
    res.status(200).json({ balance: userAccount.balance });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

accountsRouter.post("/transfer", authMiddleware, (req, res) => {
  try {
    const fromAccountId = req.userId;
    const toAccountId = req.body.to;
    const toBalance = req.body.balance;
    Accounts.findOne({ userId: fromAccountId });

    Accounts.updateOne(
      { userId: toAccountId },
      { $inc: { balance: toBalance } }
    );
    res.status(200).json({ message: "transfer successful" });
  } catch (err) {
    res.status(500).json({ message: "network error" });
  }
});

module.exports = accountsRouter;
