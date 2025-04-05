const express = require("express");
const { connectDB } = require("./db");
const router = require("./routes/index");
const cors = require("cors");
connectDB();

const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/v1", router);

app.listen(3000);
