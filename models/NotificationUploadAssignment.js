
const mongoose = require('mongoose');


const NotificationAssignmentUpload = new mongoose.Schema({
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




module.exports = mongoose.model("NotificationAssignmentUpload", NotificationAssignmentUpload,"NotificationAssignmentUpload");
