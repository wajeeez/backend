const Submission = require('./../models/stdsubmissionFile'); // Import the Assignment model
const multer = require('multer');
const { Readable } = require('stream');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

const { MongoMemoryServer } = require('mongodb-memory-server');

const fileSchema = require("./../models/assignementFile");
const quizSubmission = require('../models/QuizSubmissionFile');





async  function GetAllSubmissions(req, res) {
    try {
      const { fileURL } = req.params;
  
      if (!fileURL) {
        return res.status(400).json({ error: 'classId parameter is required' });
      }
  
      const assignments = await Submission.find({assignmentFileURL:fileURL });
      res.json(assignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  
  async  function GetALLQuizSubmission(req, res) {
    try {
      const { fileURL } = req.params;
  
      if (!fileURL) {
        return res.status(400).json({ error: 'classId parameter is required' });
      }
  
      const assignments = await quizSubmission.find({assignmentFileURL:fileURL });
      res.json(assignments);
    } catch (error) {
      console.error('Error fetching Quiz:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  
  
  
  module.exports={
    GetAllSubmissions,GetALLQuizSubmission};