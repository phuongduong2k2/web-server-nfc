const User = require("../models/User");

// Client API
exports.getAllUsers = async (req, res) => {
  try {
    const respon = await User.find({
      name: {
        $ne: "null",
      },
    });
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
    if (req.params.id) {
      await User.findByIdAndDelete(req.params.id);
    } else {
      await User.findOneAndDelete({
        name: "null",
      });
    }
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

exports.deleteUserRequest = async (req, res) => {
  try {
    const respon = await User.findOneAndDelete({
      nfcId: null,
    });
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

exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user.pinCode === req.body.pinCode) {
      res.status(200).json({
        status: "success",
        data: {
          ...user,
        },
      });
    } else throw "verify failed";
  } catch (error) {
    res.status(400).json({
      status: "failed",
      error,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    let respon = null;
    if (req.query?.nfcId) {
      respon = await User.findByIdAndUpdate(
        req.params.id,
        {
          name: "null",
          pinCode: null,
          nfcId: req.query.nfcId,
        },
        {
          new: true,
          runValidators: true,
        },
      );
    } else {
      respon = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
    }
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      error,
    });
  }
};

exports.getRequestUser = async (req, res) => {
  try {
    const user = await User.find({
      name: "null",
    });
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

// ESP8266 API
exports.getUserByNfcId = async (req, res) => {
  try {
    const respon = await User.find({
      nfcId: req.params.nfcId,
    });
    if (respon[0].name === "null") {
      await this.deleteOldRequest();

      throw 400;
    }
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

exports.addRequestUser = async (req, res) => {
  try {
    const oldUser = await User.find({
      name: "null",
    });
    if (oldUser) {
      await User.findByIdAndDelete(oldUser._id);
    }
    const user = await User.create({
      name: "null",
      pinCode: null,
      nfcId: req.params.nfcId,
    });
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
