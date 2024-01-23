const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const allotBookSchema = new Schema({
  studentId: {
    type: Number,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  bookName: {
    type: String,
    required: true,
  },
  bookId: {
    type: Number,
    required: true,
  },
  borrowedDate: {
    type: Date,
    required: true,
  },
  expectedReturnDate: {
    type: Date,
    required: true,
  },
  return_status: {
    type: Boolean, // Assuming return_status is a boolean (true for Returned, false for Pending)
    default: false, // You can set a default value if needed
  },
});

const Allot = mongoose.model('Allot', allotBookSchema);

module.exports = Allot;
