const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Data must have name!"],
  },
  pinCode: {
    type: Number,
    require: [true, "Pin code is require"],
  },
  nfcId: {
    type: String,
    unique: true,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
