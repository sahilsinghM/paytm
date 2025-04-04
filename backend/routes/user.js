const express = require("express");
const userRouter = express.Router();
const { User, Accounts } = require("../db/index");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const authMiddleware = require("../middlewares/middleware");
dotenv.config();

const userSchema = z.object({
  userName: z.string().min(3).max(50),
  firstName: z.string().min(3).max(50),
  lastName: z.string().min(3).max(50),
  password: z.string().min(8).max(50),
});

// userRouter.get("/", (req, res) => {
//   res.send("Hello World");
// });

// userRouter.post("/", (req, res) => {
//   res.send("Hello World");
// });

userRouter.post("/signup", async (req, res) => {
  const { userName, firstName, lastName, password } = req.body;
  try {
    userSchema.parse({
      userName,
      firstName,
      lastName,
      password,
    });
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
  // Check if user already exists

  try {
    const existingUser = await User.findOne({ userName: userName });
    if (existingUser) {
      return res.status(411).json({ message: "User already exists" });
    }
    const user = new User({ userName, firstName, lastName, password });
    await user.save();
    const userInitialBalance = new Accounts({ userId: user._id, balance: 0 });
    userInitialBalance.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ userId: user._id, token: token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error  " + error });
  }
});

userRouter.post("/signin", async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await User.findOne({
      userName,
      password,
    });
    if (!user) {
      return res.status(411).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error " + error });
  }
});

userRouter.put("/", authMiddleware, async (req, res) => {
  const { firstName, lastName, password } = req.body;
  try {
    const newData = {};
    if (firstName) {
      newData.firstName = firstName;
    }
    if (lastName) {
      newData.lastName = lastName;
    }
    if (password) {
      newData.password = password;
    }
    await User.findByIdAndUpdate(req.userId, newData);
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" + error });
  }
});

userRouter.get("/bulk", authMiddleware, async (req, res) => {
  try {
    const filter = req.query.filter;
    const users = await User.find({
      $or: [
        { firstName: { $regex: filter } },
        { lastName: { $regex: filter } },
      ],
    });
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).status({ error: "Internal server error" + error });
  }
});

module.exports = userRouter;
