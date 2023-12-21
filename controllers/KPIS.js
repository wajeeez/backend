
// module.exports = router;
const Assignment = require('./../models/assignmentTeacher'); // Import the Assignment model
const multer = require('multer');
const { Readable } = require('stream');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

const { MongoMemoryServer } = require('mongodb-memory-server');

const fileSchema = require("./../models/assignementFile");
const Lecture = require('../models/Lecture');
const Submissions = require('../models/stdassignmentFile')
const SubmissionModel = require('../models/stdsubmissionFile')

const NotificationUploadGroupAssignment = require('../models/NotificationUploadGroupAssignment');
const NotificationAssignmentUpload = require('../models/NotificationUploadAssignment');
const Group = require('../models/Groups');
const NotificationSubmission = require('../models/NotificationSubmission');
const GroupModel = require('../models/Groups');
const Submission = require('../models/stdsubmissionFile');
const classes = require('../models/classes');

const Quiz = require('../models/Quiz');
const quizSubmission = require('../models/QuizSubmissionFile');
// Create a MongoMemoryServer instance f



const KPIS = {


  async getTotalStudentsbyclassId(req,res,next) {

    try {
      const { _id } = req.params;

      const classData = await classes.findById(_id);
  
      if (!classData) {
        return res.status(404).json({ error: 'Class not found' });
      }
  
      const totalStudents = classData.students.length;
  
      return res.status(200).json({ totalStudents });
    } catch (error) {
      console.error('Error in Retriving Total Students:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

  },




    async getTotalStudentsbyclassId(req,res,next) {

      try {
        const { _id } = req.params;
  
        const classData = await classes.findById(_id);
    
        if (!classData) {
          return res.status(404).json({ error: 'Class not found' });
        }
    
        const totalStudents = classData.students.length;
    
        return res.status(200).json({ totalStudents });
      } catch (error) {
        console.error('Error in Retriving Total Students:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

    },

    async  getAssignmentStatistics(req, res) {
        try {
          const { class_id } = req.body;
          const { email } = req.body;
          if (!class_id || !email) {
            return res.status(400).json({ error: 'classId parameter is required' });
          }
      
          // Fetch all assignments for the given class_id
          const assignments = await Assignment.find({ classId: class_id });
          const groupAssignment = await GroupModel.find({classID: class_id})
          const lectures = await Lecture.find({ classId: class_id });
          const submisison = await Submission.find({classId:class_id,Email:email})
          const totalQ = await Quiz.find({classId:class_id})
          const submittedQ = await quizSubmission.find({classId:class_id,Email:email})
          // Calculate total number of assignments
          const totalAssignments = assignments.length;
          const totalGroupAssignment= groupAssignment.length;
          const submittedAssignments =submisison.length;
          const totalLectures = lectures.length;
          const totalQuiz = totalQ.length
          const submittedQuiz = submittedQ.length
          // Calculate total number of assignments with submission URL not empty or null
        
          const submittedGroupAssignments = groupAssignment.filter(
            (assignment) => assignment.submissionURL && assignment.submissionURL !== ""
          ).length;
      
          res.status(200).json({
            totalLectures,
            totalGroupAssignment,
            totalAssignments,
            submittedAssignments,
            submittedGroupAssignments,
            totalQuiz,
            submittedQuiz
          });
        } catch (error) {
          console.error('Error fetching assignment statistics:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      }
      

}


module.exports = KPIS;
