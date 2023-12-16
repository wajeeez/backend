const Assignment = require('./../models/assignmentTeacher'); // Import the Assignment model
const multer = require('multer');
const { Readable } = require('stream');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

const { MongoMemoryServer } = require('mongodb-memory-server');

const fileSchema = require("./../models/assignementFile");
const Lecture = require('../models/Lecture');   
async function UploadAssignment(req, res, next) {
    try {
      // Check if a file was uploaded
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      const { originalname, buffer, mimetype } = req.file;
      const { classId, teacherID, fileName, subjectName, deadline } = req.body;
  
  
      const file = new fileSchema({
        name: originalname,
        data: buffer,
        contentType: mimetype,
      });
  
      // Save the file document
      const savedFile = await file.save();
  
      // Access the _id field of the saved file
      const fileURL = savedFile._id;
      console.log(fileURL)
  
      const newAssignment = new Assignment({
        classId,
        teacherID,
        subjectName,
        fileName,
        fileURL,
        deadline, // Save the deadline in the Assignment model
      });
  
      await newAssignment.save();
  
  
      return res.status(201).json({ message: 'Assignment uploaded successfully' });
    } catch (err) {
      // Handle any errors that occurred during assignment upload
      return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
  };
  
  