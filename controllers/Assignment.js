
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

async function UploadAssignment(req, res, next) {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, buffer, mimetype } = req.file;
    const { classId, title, teacherID, fileName, subjectName, deadline,time, totalMarks } = req.body;


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
      title,
      totalMarks,
      teacherID,
      subjectName,
      fileName,
      time,
      fileURL,
      deadline, // Save the deadline in the Assignment model
    });

    await newAssignment.save();

 
    const notification = new NotificationAssignmentUpload({
      classId: classId,
      message: "New Assignment Uploaded",
      deadline: deadline, // Save the deadline in the Assignment model
      time:time,
    });

    await notification.save();

    return res.status(201).json({ message: 'Assignment uploaded successfully' });
  } catch (err) {
    // Handle any errors that occurred during assignment upload
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};


async function UploadGroupAssignment(req, res, next) {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, buffer, mimetype } = req.file;
    const { groupId, classId, deadline ,time} = req.body;


    const group = await Group.findOne({ _id: groupId })

    if (!group) {
      return res.status(404)
    } else {


      const file = new fileSchema({
        name: originalname,
        data: buffer,
        contentType: mimetype,
      });

      // Save the file document
      const savedFile = await file.save();
      console.log(savedFile._id)
      const fileURL = savedFile._id;
      group.fileURL = fileURL;
      group.deadline = deadline;
      group.time =time;


      await group.save();


      const groupNotification = new NotificationUploadGroupAssignment({

        classId: classId,
        message: "New Assignment Uploaded",
        deadline: deadline, 
        time:time,// Save the deadline in the Assignment model
      });

      await groupNotification.save();


      return res.status(200).json({ message: 'Assignment uploaded successfully' });

    }



  } catch (err) {
    // Handle any errors that occurred during assignment upload
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};






async function deleteGroup (req,res,next){
  try {
    const { groupId } = req.params;

    // Find and delete the group
    const deletedGroup = await Group.findOneAndDelete({ _id: groupId });

    if (!deletedGroup) {
      return res.status(404).json({ message: 'Group not found' });
    }

    return res.status(200).json({ message: 'Group deleted successfully' });
  } catch (err) {
    // Handle any errors that occurred during group deletion
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }


};

async function UploadSubmission(req, res, next) {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, buffer, mimetype } = req.file;
    const { groupId, classId } = req.body;


    const group = await Group.findOne({ _id: groupId })

    if (!group) {
      return res.status(404)
    } else {


      const file = new fileSchema({
        name: originalname,
        data: buffer,
        contentType: mimetype,
      });

      // Save the file document
      const savedFile = await file.save();
      console.log(savedFile._id)
      const fileURL = savedFile._id;
      group.submissionURL = fileURL;

      await group.save();






      return res.status(200).json({ message: 'Assignment uploaded successfully' });

    }



  } catch (err) {
    // Handle any errors that occurred during assignment upload
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};



async function UploadLecture(req, res, next) {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, buffer, mimetype } = req.file;
    const { classId, teacherID, lectureName, lectureDesc, lectureLink, remarks } = req.body;

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

    const newLecture = new Lecture({
      classId,
      teacherID,
      lectureName,
      lectureDesc,
      lectureLink,
      fileURL,
      remarks, // Save the deadline in the Assignment model
    });

    await newLecture.save();


    return res.status(201).json({ message: 'Lecture uploaded successfully' });
  } catch (err) {
    // Handle any errors that occurred during assignment upload
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};





async function EditLecture(req, res, next) {
  try {
    const lectureId = req.params.fileURL;


    const { originalname, buffer, mimetype } = req.file;
    const { classId, teacherID, lectureName, lectureDesc, lectureLink, remarks } = req.body;
    const existingLecture = await Lecture.findById(lectureId);

    if (!existingLecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }

    // Update file information if a new file is provided
    if (req.file) {
      // Remove the existing associated file
      await fileSchema.findByIdAndRemove(existingLecture.fileURL);

      // Create a new file document
      const newFile = new fileSchema({
        name: originalname,
        data: buffer,
        contentType: mimetype,
      });

      // Save the new file document
      const savedFile = await newFile.save();

      // Update the file URL in the existing lecture
      existingLecture.fileURL = savedFile._id;
    }

    // Update other lecture information
    existingLecture.classId = classId;
    existingLecture.teacherID = teacherID;
    existingLecture.lectureName = lectureName;
    existingLecture.lectureDesc = lectureDesc;
    existingLecture.lectureLink = lectureLink;
    existingLecture.remarks = remarks;

    // Save the updated lecture
    await existingLecture.save();

    return res.status(200).json({ message: 'Lecture updated successfully' });


  } catch (err) {
    // Handle any errors that occurred during assignment upload
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

async  function SubmitGroupMarks(req, res, next) {

  try {
      // Check if a marks was uploaded
      const { _id, marks  , remarks} = req.body;


     
      const uploadMarks = await Group.findByIdAndUpdate(
        _id,
        {
          marks: marks,
          remarks: remarks,
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


async function editTeacherAssignment(req, res, next) {
  try {
    const assignmentId = req.params._id;
    const { originalname, buffer, mimetype } = req.file;
    const { classId, teacherID, fileName, title,time, remarks } = req.body;

    const existingAssignment = await Assignment.findById(assignmentId);

    if (!existingAssignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Update file information if a new file is provided
    if (req.file) {
      // Remove the existing associated file
      if (existingAssignment.fileURL) {
        await fileSchema.findByIdAndRemove(existingAssignment.fileURL);
      }

      // Create a new file document
      const newFile = new fileSchema({
        name: originalname,
        data: buffer,
        contentType: mimetype,
      });

      // Save the new file document
      const savedFile = await newFile.save();
      existingAssignment.fileURL = savedFile._id;
    }

    // Update other assignment information if provided
    if (classId) existingAssignment.classId = classId;
    if (teacherID) existingAssignment.teacherID = teacherID;
    if (fileName) existingAssignment.fileName = fileName;
    if (title) existingAssignment.title = title;
    if (time) existingAssignment.time = time
    if (remarks) existingAssignment.remarks = remarks;

    // Save the updated assignment
    await existingAssignment.save();

    return res.status(200).json({ message: 'Assignment updated successfully' });

  } catch (err) {
    // Handle any errors that occurred during assignment upload
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
}






async function DeleteLecture(req, res, next) {
  try {
    const fileURL = req.params.fileURL;

    // Find the lecture by its ID
    const existingLecture = await Lecture.findOne({ fileURL: fileURL });

    if (!existingLecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }

    // Remove the associated file
    await fileSchema.findByIdAndRemove(existingLecture.fileURL);

    // Delete the lecture
    await Lecture.deleteOne({ fileURL: fileURL });


    return res.status(200).json({ message: 'Lecture deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};



//DELETE ASSIGNEMENT 


async function deleteAssignment(req, res, next) {
  try {
    const _id = req.params._id;

    // Find the assignment by fileURL
    const assignment = await Assignment.findOne({_id: _id });
    // const submit = await Submissions.findOne({ _id:_id });

    if (!assignment ) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Delete the assignment
    await Assignment.deleteOne({ _id: _id });
    // await Submissions.deleteOne({ fileURL: fileURL });

    return res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (err) {
    // Handle any errors that occurred during assignment deletion
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

//Notification

async function getAssignmentNotification(req, res, next) {
  try {
    const classId = req.params.classId;
    const assignment = await NotificationAssignmentUpload.find({ classId: classId });

    if (!assignment) {
      return res.json([]);
    }

    console.log(assignment);

    return res.status(200).json(assignment);;
  } catch (err) {
    // Handle any errors that occurred during assignment deletion
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};


async function getSubmissionNotification(req, res, next) {
  try {
    const classId = req.params.classId;

    // Find the assignment by fileURL
    const assignment = await NotificationSubmission.find({ classId: classId });

    if (!assignment) {
      return res.json([]);
    }


    return res.status(200).json(assignment);;
  } catch (err) {
    // Handle any errors that occurred during assignment deletion
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};






async function deleteSubmission(req, res, next) {
  try {
    const fileURL = req.params.fileURL;
    const assignURL = req.body.assignURL;


    const submissionFileURL = fileURL
    // // Find the assignment by fileURL
    // const assignment = await Assignment.findOne({fileURL: fileURL });
    const submission = await Submissions.findById(fileURL);
    const submitModel = await SubmissionModel.find({submissionFileURL:submissionFileURL})
    if (!submission || !submitModel) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    console.log('File URL:', fileURL, typeof fileURL);
    console.log('Assign URL:', assignURL, typeof assignURL);

    // Update the assignment
    const updateResult = await Assignment.updateOne(
      { fileURL: assignURL.toString() },
      {
        $pull: { submissionURL: fileURL.toString() },
      },
      { new: true }
    );

    // Check if the assignment update was successful
    if (updateResult.nModified === 0) {
      // If no documents were modified, it means the assignment was not found or the value wasn't in the array
      return res.status(404).json({ message: 'Assignment not found or submissionURL not in array' });
    }

    // Delete the submission
    await Submissions.deleteOne({ _id: fileURL });

    await SubmissionModel.deleteOne({submissionFileURL:submissionFileURL})

    

    return res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (err) {
    // Handle any errors that occurred during assignment deletion
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

module.exports = {
  UploadAssignment, UploadLecture, UploadGroupAssignment
  , deleteAssignment, DeleteLecture, deleteSubmission,deleteGroup,
  EditLecture, UploadSubmission,SubmitGroupMarks, getAssignmentNotification,editTeacherAssignment, getSubmissionNotification
};