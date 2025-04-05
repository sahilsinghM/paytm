const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { number } = require("zod");
dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const AccountsSchema = new mongoose.Schema({
  userId: {
    required: true,
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  balance: {
    type: Number,
    required: true,
  },
});

const TransectionSchema = new mongoose.Schema({
  toUserId: {
    required: true,
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  fromUserId: {
    required: true,
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  amount: {
    type: Number,
    required: true,
  },
  remarks: {
    type: String,
  },
});

const User = mongoose.model("User", UserSchema);
const Accounts = mongoose.model("Account", AccountsSchema);
const Transactions = mongoose.model("Transactions", TransectionSchema);

// module.exports = ;
module.exports = {
  connectDB,
  User,
  Accounts,
  Transactions,
};
