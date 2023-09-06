const mongoose = require("mongoose");
const {MONGODB_CONNECTION_STRING}=require('../config/config')


 mongoose
  .connect(
    MONGODB_CONNECTION_STRING )
  .then(() => {
    console.log("Connected Successfully with MongoDB");
  })
  .catch(() => {
    console.log("Failed to Connect with MongoDB");
  });
