const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  reg_no: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;