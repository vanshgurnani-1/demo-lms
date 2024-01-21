const express = require('express');
const router = express.Router();
const Student = require('../model/student');



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
  








module.exports = router;