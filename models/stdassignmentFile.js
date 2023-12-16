const mongoose = require('mongoose');

const stdAssignmentFile = new mongoose.Schema({
  email:String,
  classId:String,
  name: String, // Name of the file
  data: Buffer, // Binary data of the file
  contentType: String, // Content type (e.g., 'application/pdf')
});

module.exports = mongoose.model('submissionFiles', stdAssignmentFile);
