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

router.get('/getAllot/:studentId', async (req,res)=>{
  const studentId = req.params.studentId;
  try{
      const allot = await Allot.findOne({ studentId });
      res.json(allot);
  }
  catch(error){
      console.error('Error fetching:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
})

router.post('/postAllotBook', async (req, res) => {
    try {

      const { studentId, studentName, bookName, bookId, borrowedDate, expectedReturnDate,return_status } = req.body;
  
      const newAllotment = new Allot({
        studentId,
        studentName,
        bookName,
        bookId,
        borrowedDate,
        expectedReturnDate,
        return_status
      });
  
      await newAllotment.save();
  
      res.status(201).json({ message: 'Book allotted successfully', allotment: newAllotment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.put('/updateAllotByBookId/:studentId', async (req, res) => {
  const studentId = req.params.studentId;

  try {
    // Find the allotment by bookId
    const allot = await Allot.findOne({ studentId });

    if (!allot) {
      return res.status(404).json({ message: 'Allotment not found' });
    }

    // Update the return status with the new data
    allot.return_status = req.body.return_status;

    // Save the updated allotment
    await allot.save();

    res.json({ message: 'Return status updated successfully', allot });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




module.exports = router;