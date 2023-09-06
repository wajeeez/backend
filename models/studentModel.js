const mongoose = require('mongoose');

const students = new mongoose.Schema({
    stdName:{
        type: String,
        required: false
    },
    stdEmail: {
        type: String,
        required: true
      },
      classID: {
        type: [String],
        required: true
      },
      
      teacherID: {
        type: String,
        required: true
      },
      teacherEmail: {
        type: String,
        required: true
      },
    
      password:{
        type:String,
        required:true
      }
    
});


const StudentModel= mongoose.model('Students', students);

module.exports = StudentModel;


