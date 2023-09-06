const express = require("express");
const collection = require("./models/teachermodel");
const dbConnect = require("./db/database");
const cors = require("cors");
const errorHandler=require('./middleware/errorhandler')
const router = require('./routes/routes')
const cookieParser =require('cookie-parser')
const {PORT} =require('./config/config')
const multer = require('multer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const { Readable } = require('stream');
const Assignment = require('./models/assignmentTeacher');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const stdAssignmentFile =require("./models/stdassignmentFile")

// const upload = multer({ dest: 'uploads/' });

// const corsOptions ={
//     credential:true,
//     origin:"*"
// }

const app = express();

const corsOptions = {

  origin: "*",
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser())
app.use(express.json());
app.use(bodyParser.json());
app.use(upload.single('file'));
app.use(router)
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler)



// const Assignment = require('./models/assignmentTeacher'); // Import the Assignment model
//. Other server setup ...

// Route to handle file downloads
const File = require("./models/assignementFile");
const Submission = require("./models/stdsubmissionFile");
const stdassignmentFile = require("./models/stdassignmentFile");
app.get('/files/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

       res.setHeader('Content-Type', file.contentType);

    res.send(file.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving file' });
  }
});


app.get('/submission/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await stdAssignmentFile.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.setHeader('Content-Type', file.contentType);
    res.send(file.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving file' });
  }
});

// app.get('/send-email', (req, res) => {
//   const to = 'qfaaf@gmail.com'; // Replace with the recipient's email address
  
//   sendEmail(to, subject, text);

//   res.send('Email sent!');
// });
// app.use(cors())

// const server = require("http").Server(app);
// const { v4: uuidv4 } = require("uuid");
// app.set("view engine", "ejs");




// const io = require("socket.io")(server, {
//   cors: {
//     origin: '*'
//   }
// });
// const { ExpressPeerServer } = require("peer");
// const opinions = {
//   debug: true,
// }

// app.use("/peerjs", ExpressPeerServer(server, opinions));
// app.use(express.static("public"));

// app.get("/", (req, res) => {
//   res.json({ msg: "Working Alright" })
// });


// // app.get("/:room", (req, res) => {
// //   res.render("room", { roomId: req.params.room });
// // });


// app.get("/:classId", (req, res) => {
//   res.render("room", { classId: req.params.classId });
// });

// io.on("connection", (socket) => {
//   socket.on("join-room", (classId, userId, userName) => {
//     socket.join(classId);
//     setTimeout(()=>{
//       socket.to(classId).broadcast.emit("user-connected", userId);
//     }, 3000)
//     socket.on("message", (message) => {
//       io.to(classId).emit("createMessage", message, userName);
//     });
//   });
// });


app.listen(PORT, () => console.log("Backend is running"+{PORT}));





// const express = require("express");
// const app = express();
// const server = require("http").Server(app);
// const { v4: uuidv4 } = require("uuid");
// app.set("view engine", "ejs");



// const io = require("socket.io")(server, {
//   cors: {
//     origin: '*'
//   }
// });
// const { ExpressPeerServer } = require("peer");
// const opinions = {
//   debug: true,
// }

// app.use("/peerjs", ExpressPeerServer(server, opinions));
// app.use(express.static("public"));

// app.get("/", (req, res) => {

//  res.json('WORKING OWOW')
// });
// app.get("/:classId", (req, res) => {
//   res.render("room", { classId: req.params.classId });
// });
// // app.get("/:room", (req, res) => {
// //   res.render("room", { roomId: req.params.room });
// // });

// io.on("connection", (socket) => {
//   socket.on("join-room", (classId, userId, userName) => {
//     socket.join(classId);
//     setTimeout(()=>{
//       socket.to(classId).broadcast.emit("user-connected", userId);
//     }, 1000)
//     socket.on("message", (message) => {
//       io.to(classId).emit("createMessage", message, userName);
//     });
    
//   });
// });

// server.listen(process.env.PORT || 5000 );
