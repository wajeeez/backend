

const Assignment = require('../models/assignmentTeacher');
const Submission = require('./../models/stdsubmissionFile');





const TeacherMarks_Remarks ={




    
async  SubmitMarks(req, res, next) {

    try {
        // Check if a marks was uploaded
        const { Email ,classId,submissionFileURL, marks  , remarks} = req.body;


       
        const uploadMarks = await Submission.findOneAndUpdate(
          { Email:Email,submissionFileURL: submissionFileURL, classId: classId },
          {
            marks: marks,
            remarks: remarks ,
          },
          { new: true }
        );
        if (!uploadMarks) {
          return res.status(404).json({ message: `Failed to Update 1 ` });
        }
        
    
        return res.status(201).json({ message: 'Marks uploaded successfully' });
      } catch (err) {
        // Handle any errors that occurred during assignment upload
        return res.status(500).json({ message: 'Internal Server Error', error: err.message });
      }
    

    
}
}
module.exports = TeacherMarks_Remarks;

