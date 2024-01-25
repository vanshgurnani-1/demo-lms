const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  name: {
    type: String
  },
  reg_no: { type: Number },
  price: {
    type: String
  },
  quantity: {
    type: Number
  },
  available:{
    type:Number
  }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;