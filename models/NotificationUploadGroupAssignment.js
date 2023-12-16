
const mongoose = require('mongoose');


const NotificationUploadGroupAssignment = new mongoose.Schema({
  classId: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true,
  },
  message: {
    type: [String],
    required: true
  }


});




module.exports = mongoose.model("NotificationUploadGroupAssignment", NotificationUploadGroupAssignment,"NotificationUploadGroupAssignment");
