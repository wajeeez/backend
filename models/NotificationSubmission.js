
const mongoose = require('mongoose');


const NotificationSubmission = new mongoose.Schema({
  classId: {
    type: String,
    required: true
  },
 
  message: {
    type: [String],
    required: true
  }


});

module.exports = mongoose.model("NotificationSubmission", NotificationSubmission,"NotificationSubmission");
