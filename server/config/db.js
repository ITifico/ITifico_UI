const { default: mongoose } = require("mongoose");
const ErrorResponse = require("../utils/errorResponse");

const mongoDB = async (uri) => {
  await mongoose
    .connect(uri, () => {
      console.log("MongoDB connected!");
    })
    .catch((err) => new ErrorResponse(err.message, 500));
};

module.exports = mongoDB;
