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

const User = mongoose.model("User", UserSchema);
const Accounts = mongoose.model("Account", AccountsSchema);

module.exports = connectDB;
module.exports.User = User;
module.exports.Accounts = Accounts;
