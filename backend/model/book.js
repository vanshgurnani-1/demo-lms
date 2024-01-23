const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  name: {
    type: String
  },
  reg_no: { type: Number, required: true, unique: true },
  price: {
    type: String
  },
  quantity: {
    type: String
  }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;