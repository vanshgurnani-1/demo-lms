require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    
    const dbURI = process.env.MONGODB_URI;

    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;