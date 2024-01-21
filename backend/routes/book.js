const express = require('express');
const router = express.Router();
const Book = require('../model/book');



router.get('/',async (req,res)=>{
    res.send("Welcome to the LMS-Book API");
})

router.get('/getBook',async (req,res)=>{
    try{
        const book = await Book.find({});
        res.json(book);
    }
    catch(error){
        console.error('Error fetching:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})


router.post('/postBook', async (req, res) => {
    try {

      const { name, reg_no, price, quantity } = req.body;
  
      
      const newBook = new Book({
        name,
        reg_no,
        price,
        quantity,
      });
  
      
      const savedBook = await newBook.save();
  
      res.status(201).json(savedBook);
    } catch(error){
        console.error('Error fetching:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  });




module.exports = router;