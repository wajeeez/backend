const mongoose = require('mongoose');

const Groups = new mongoose.Schema({
      
      stdIds: {
          type: [String],
          required: true
        },
      classID: {
        type: String,
        required: true
      },
      fileURL: {
        type: String,
        default:""
      },
      fileName:{
        type:String,
        default:""
      },
      submissionURL:{
        type:String,
        default:""
      },
      deadline: {
        type: Date,
        default:""
      },
      time: {
        type: String,
        default:"",
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


const GroupModel= mongoose.model('Groups', Groups);

module.exports = GroupModel;


