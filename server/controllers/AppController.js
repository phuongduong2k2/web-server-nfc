const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const respon = await User.find();
    res.status(200).json({
      status: "success",
      data: {
        ...respon,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      error,
    });
  }
};

exports.createNewUser = async (req, res) => {
  try {
    const respon = await User.create(req.body);
    res.status(200).json({
      status: "success",
      data: {
        ...respon,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      error,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    console.log(req);
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      error,
    });
  }
};

exports.checkPinCode = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    console.log(user);
    res.status(200).json({
      status: "success",
      data: {
        ...user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      error,
    });
  }
};
