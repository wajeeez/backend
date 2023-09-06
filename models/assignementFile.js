const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: String, // Name of the file
  data: Buffer, // Binary data of the file
  contentType: String, // Content type (e.g., 'application/pdf')
});

module.exports = mongoose.model('AssignmentFile', fileSchema);
