const express = require('express');
const router = express.Router();
const Allot = require('../model/allotBook');



router.get('/',async (req,res)=>{
    res.send("Welcome to the LMS-allotBook API");
})


router.get('/getAllot', async (req,res)=>{
    try{
        const allot = await Allot.find({});
        res.json(allot);
    }
    catch(error){
        console.error('Error fetching:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post('/postAllotBook', async (req, res) => {
    try {

      const { studentId, studentName, bookName, bookId, borrowedDate, expectedReturnDate } = req.body;
  
      const newAllotment = new Allot({
        studentId,
        studentName,
        bookName,
        bookId,
        borrowedDate,
        expectedReturnDate,
      });
  
      await newAllotment.save();
  
      res.status(201).json({ message: 'Book allotted successfully', allotment: newAllotment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;