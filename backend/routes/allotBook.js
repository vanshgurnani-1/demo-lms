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

module.exports = router;