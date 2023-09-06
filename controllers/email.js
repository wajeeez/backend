// email.js
const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Replace with your email service provider
  auth: {
    user: 'e.officialspace@gmail.com', // Replace with your email address
    pass: 'fnqjpgacrdaqdbrs', // Replace with your email password
  },
});

// Function to send an email
async function sendEmail(to,password) {
  let mailOptions ;
 
  if(password === ""){
     mailOptions = {
      from: 'e.officialspace@gmail.com',
      to: to,
      subject: 'Welcome to E-SPACE: Your Learning Journey Begins!',
      text: `Dear Student,
    
    We are thrilled to welcome you to E-SPACE, your ultimate platform for a dynamic and enriching learning experience. As you embark on your educational journey with us, we want to express our excitement and dedication to supporting your growth and success.
    
    At E-SPACE, our mission is to empower you with knowledge, skills, and opportunities that will shape your future. Whether you're seeking to explore new subjects, enhance your existing expertise, or connect with a community of like-minded learners, E-SPACE is here to provide you with the tools and resources you need to excel.
    
    Here's a glimpse of what awaits you:
    
    1. Interactive Courses: Our diverse range of courses, led by expert instructors, will immerse you in engaging learning experiences that cater to various interests and skill levels.
    
    2. Cutting-edge Technology: Experience state-of-the-art learning technology that adapts to your pace, enabling you to learn at your own convenience and comfort.
    
    3. Community Collaboration: Connect with fellow learners, share insights, and engage in meaningful discussions to foster a collaborative learning environment.
    
    4. Personalized Learning Paths: Tailor your learning journey to meet your goals by choosing courses that align with your aspirations and career objectives.
    
    5. Constant Innovation: Our commitment to innovation ensures that you stay ahead in a rapidly evolving world by learning the latest trends and technologies.
    
    Get ready to explore, learn, and grow with E-SPACE. We're here to support you every step of the way.
    
    If you have any questions, need assistance, or want to explore our course offerings, don't hesitate to reach out to our dedicated support team at support@espacelearning.com.
    
    Once again, welcome to E-SPACE! We're excited to have you join our community of passionate learners.
    
    Best regards,
    E-SPACE Learning Platform
    
    
    `
    };
  }else{

     mailOptions = {
      from: 'e.officialspace@gmail.com',
      to: to,
      subject: 'Welcome to E-SPACE: Your Learning Journey Begins!',
      text: `Dear Student,
    
    We are thrilled to welcome you to E-SPACE, your ultimate platform for a dynamic and enriching learning experience. As you embark on your educational journey with us, we want to express our excitement and dedication to supporting your growth and success.
    
    At E-SPACE, our mission is to empower you with knowledge, skills, and opportunities that will shape your future. Whether you're seeking to explore new subjects, enhance your existing expertise, or connect with a community of like-minded learners, E-SPACE is here to provide you with the tools and resources you need to excel.
    
    Here's a glimpse of what awaits you:
    
    1. Interactive Courses: Our diverse range of courses, led by expert instructors, will immerse you in engaging learning experiences that cater to various interests and skill levels.
    
    2. Cutting-edge Technology: Experience state-of-the-art learning technology that adapts to your pace, enabling you to learn at your own convenience and comfort.
    
    3. Community Collaboration: Connect with fellow learners, share insights, and engage in meaningful discussions to foster a collaborative learning environment.
    
    4. Personalized Learning Paths: Tailor your learning journey to meet your goals by choosing courses that align with your aspirations and career objectives.
    
    5. Constant Innovation: Our commitment to innovation ensures that you stay ahead in a rapidly evolving world by learning the latest trends and technologies.
    
    Get ready to explore, learn, and grow with E-SPACE. We're here to support you every step of the way.
    
    If you have any questions, need assistance, or want to explore our course offerings, don't hesitate to reach out to our dedicated support team at support@espacelearning.com.
    
    Once again, welcome to E-SPACE! We're excited to have you join our community of passionate learners.

    Your Password is ${password}
    
    Best regards,
    E-SPACE Learning Platform
    
    
    `
    };
  }



  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = sendEmail;
