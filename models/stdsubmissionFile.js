const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  Email:{
    type: String,   
    required: true,
  },
  classId :{
    type: String,   
    required: true,
  },

  assignmentFileURL: {
    type: String,   
    required: true,
  },
  submissionFileURL: {
    type: String,
    required: true, 
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },

  marks:{
    type: String,
    default:""
  },
  remarks:{
    type: String,
    default:""
  }




    
});

const Submission = mongoose.model('Submissions', submissionSchema);

module.exports = Submission;
