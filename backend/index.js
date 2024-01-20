// backend/server.js
const express = require('express');
// const cors = require('cors');
// const User = require('./models/usersmodel');
const connectDB = require('../backend/connector/connection');
const studentRoutes = require('../backend/routes/student');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());


connectDB();


app.use('/student', studentRoutes);


// Define a route for the home route ("/")
app.get('/', (req, res) => {
  res.send('Welcome to the LMS API');
});

// More routes for reading, updating, and deleting notes

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});