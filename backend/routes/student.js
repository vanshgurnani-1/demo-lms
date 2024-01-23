const express = require('express');
const router = express.Router();
const Student = require('../model/student');
const mongoose = require('mongoose');


router.get('/',async (req,res)=>{
    res.send("Welcome to the LMS-Student API");
})

router.get('/getStudent',async (req,res)=>{
    try{
        const student = await Student.find({});
        res.json(student);
    }
    catch(error){
        console.error('Error fetching:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/getRole/:role',async (req,res)=>{
    try{
        const role = req.params.role;
        const student = await Student.find({role});
        res.json(student);
    }
    catch(error){
        console.error('Error fetching:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/getId/:id',async (req,res)=>{
  try{
      const id = req.params.id;
      const student = await Student.findOne({id});
      res.json(student);
  }
  catch(error){
      console.error('Error fetching:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
})



router.post('/postStudent', async (req, res) => {
    try {
      const { id, name, role, phone, batch } = req.body;
  
      const newStudent = new Student({
        id,
        name,
        role,
        phone,
        batch,
      });

      const savedStudent = await newStudent.save();
  
      res.status(201).json(savedStudent);
    } catch (error) {

      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  router.delete('/deleteStudent/:id', async (req, res) => {
    try {
      const studentId = req.params.id;

  
      // Using deleteOne to delete a single document based on the custom 'id' field
      const result = await Student.deleteOne({ id: studentId });
  
      if (result.deletedCount === 1) {
        res.json({ message: 'Student deleted successfully' });
      } else {
        res.status(404).json({ error: 'Student not found' });
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  router.put('/updateStudent/:id', async (req, res) => {
    const studentId = req.params.id;
  
    try {
      // Find the student by ID
      const student = await Student.findOne({ id: studentId });
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Update the student with the new data
      student.name = req.body.name || student.name;
      student.role = req.body.role || student.role;
      student.phone = req.body.phone || student.phone;
      student.batch = req.body.batch || student.batch;
  
      // Save the updated student
      await student.save();
  
      res.json({ message: 'Student updated successfully', student });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  









module.exports = router;