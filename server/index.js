const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

dotenv.config({ path: `${__dirname}/config.env` });

const app = express();
const AppRouter = require("./routes/AppRouter");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {})
  .then(() => {
    console.log("Database connection success!");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);
app.use(express.json());
app.use("/api/users", AppRouter);

const port = 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
