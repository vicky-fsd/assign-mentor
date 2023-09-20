const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");


//Importing the models

const Mentor = require("./models/Mentor");
const Student = require("./models/Student");

const app = express();

const PORT=3000
const DB_URL='mongodb+srv://vk1996vignesh:vicky2426@vignesh1.7mepsp4.mongodb.net/'


app.use(bodyParser.json());

mongoose
  .connect(DB_URL, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Could not connect to MongoDB", err));

  //Create Mentor

  app.post('/mentor', async (req,res)=>{
    try {
            const mentor = new Mentor (req.body);
            await mentor.save();
            res.send(mentor);
    }
    catch (error) {  
        res.status(400).send(error);
    }
  })

//Create Student

  app.post('/student', async (req,res)=>{
    try {
            const student = new Student (req.body);
            await student.save();
            res.send(student);
    }
    catch (error) {  
        res.status(400).send(error);
    }
  })

  // Assign
app.post("/mentor/:mentorId/assign", async (req, res) => {
    try {
      const mentor = await Mentor.findById(req.params.mentorId);
      const students = await Student.find({ _id: { $in: req.body.students } });
      students.forEach((student) => {
        student.cMentor = mentor._id;
        student.save();
      });
      mentor.students = [
        ...mentor.students,
        ...students.map((student) => student._id),
      ];
      await mentor.save();
      res.send(mentor);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  //Assign and change
  app.put("/student/:studentId/assignMentor/:mentorId", async (req, res) => {
    try {
      const student = await Student.findById(req.params.studentId);
      const nMentor = await Mentor.findById(req.params.mentorId);
  
      if (student.cMentor) {
        student.pMentor.push(student.cMentor);
      }
  
      student.cMentor = nMentor._id;
      await student.save();
      res.send(student);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  // Show all students for a particular mentor
  app.get("/mentor/:mentorId/students", async (req, res) => {
    try {
      const mentor = await Mentor.findById(req.params.mentorId).populate(
        "students"
      );
      res.send(mentor.students);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  app.get("/student/:studentId/pMentor", async (req, res) => {
    try {
      const mentor = await Student.findById(req.params.studentId).populate(
        "pMentor"
      );
      res.send(mentor.pMentor);
    } catch (error) {
      res.status(400).send(error);
    }
  });

app.listen(PORT, ()=>{
    console.log(`The Server Running on http://localhost:${PORT}`)
})
