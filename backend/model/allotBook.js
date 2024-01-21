const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const allotBookSchema = new Schema({
  studentId: {
    type: String,
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
    type: String,
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
});

const Allot = mongoose.model('Allot', allotBookSchema);

module.exports = Allot;
