const express = require('express');
const router = express.Router();
const Allot = require('../model/allotBook');
const Book = require('../model/book');



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
    const { studentId, studentName, bookName, bookId, borrowedDate, expectedReturnDate, return_status } = req.body;

    // Check if the book is available
    const allottedBook = await Book.findOne({ reg_no: bookId });

    console.log('Allotted Book:', allottedBook);

    if (!allottedBook || isNaN(allottedBook.available) || allottedBook.available <= 0) {
      console.log('Book not available for allotment');
      return res.status(400).json({ message: 'Book not available for allotment' });
    }

    // Update the return status of the allotted book
    const newAllotment = new Allot({
      studentId,
      studentName,
      bookName,
      bookId,
      borrowedDate,
      expectedReturnDate,
      return_status,
    });

    // Update the available quantity of the allotted book in the Book model
    allottedBook.available = allottedBook.available - 1; // Decrease available quantity by 1
    allottedBook.quantity = allottedBook.quantity - 1;
    await allottedBook.save();

    // Save the new allotment
    await newAllotment.save();

    res.status(201).json({ message: 'Book allotted successfully', allotment: newAllotment });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



router.put('/updateAllot/:studentId', async (req, res) => {
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

router.get('/getAllotNotReturned', async (req, res) => {
  try {
    const allotNotReturned = await Allot.find({ return_status: false });
    res.json(allotNotReturned);
  } catch (error) {
    console.error('Error fetching:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





module.exports = router;