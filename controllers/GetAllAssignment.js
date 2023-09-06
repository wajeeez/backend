


const Assignment = require('./../models/assignmentTeacher'); // Import the Assignment model
const multer = require('multer');
const { Readable } = require('stream');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

const { MongoMemoryServer } = require('mongodb-memory-server');

const fileSchema = require("./../models/assignementFile")

async  function getAllAssignments(req, res) {
    try {
      const { class_id } = req.params;
  
      if (!class_id) {
        return res.status(400).json({ error: 'classId parameter is required' });
      }
  
      const assignments = await Assignment.find({classId:class_id });
      res.json(assignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  
  
  module.exports=getAllAssignments;