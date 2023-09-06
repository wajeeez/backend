// // routes/assignments.js
// const express = require('express');
// const multer = require('multer');

// const router = express.Router();

// // Configure multer for file uploads
// const upload = multer({ dest: 'uploads/' });

// // Handle assignment upload
// router.post('/upload', upload.single('file'), (req, res) => {
//   // Save the assignment details to the database
//   const { title, description, deadline } = req.body;
//   const file = req.file;

//   // Save the assignment details and file path to the database
//   // ...

//   res.status(200).json({ message: 'Assignment uploaded successfully' });
// });

// // Handle assignment submission
// router.post('/submit', upload.single('file'), (req, res) => {
//   // Save the submission details to the database
//   const { assignmentId, studentId } = req.body;
//   const file = req.file;

//   // Save the submission details and file path to the database
//   // ...

//   res.status(200).json({ message: 'Assignment submitted successfully' });
// });

// // Get assignments
// router.get('/', (req, res) => {
//   // Fetch assignments from the database
//   // ...

//   res.status(200).json(assignments);
// });

// module.exports = router;
const Assignment = require('./../models/assignmentTeacher'); // Import the Assignment model
const multer = require('multer');
const { Readable } = require('stream');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

const { MongoMemoryServer } = require('mongodb-memory-server');

const fileSchema = require("./../models/assignementFile")

// Create a MongoMemoryServer instance f

async function UploadAssignment(req, res, next) {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, buffer, mimetype } = req.file;
    const { classId, teacherID, subjectName, deadline } = req.body;


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

module.exports = UploadAssignment;