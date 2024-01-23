import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CategorySearch = ({ handleAllotChange }) => {
  const [open, setOpen] = useState(false);
  const [bookName, setBookName] = useState('');
  const [showName, setShowName] = useState('');
  const [filterBooks, setFilterBooks] = useState([]);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await axios.get(`http://localhost:5000/book/getBookByName/${bookName}`);
        setFilterBooks(response.data ? [response.data] : []);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    }

    if (bookName !== '') {
      fetchBooks();
    } else {
      setFilterBooks([]);
    }
  }, [bookName]);

  const handleChange = (book) => {
    setShowName(book.name);
    setBookName('');
    setOpen(false);

    // Pass both book_id and book_name to the parent component
    handleAllotChange({ target: { name: 'book_id', value: book.reg_no } });
    handleAllotChange({ target: { name: 'book_name', value: book.name } });

    // Call handleBookNameChange with the entered book name
    handleAllotChange(book.name);
  };

  return (
    <>
      <div className="my-5 w-[90%] pl-7 h-11">
        <div className="relative group">
          <div
            onClick={() => setOpen((prev) => !prev)}
            id="dropdown-button"
            className="inline-flex justify-between w-full min-w-[300px] border-b-2 border-b-black px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 h-11 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
          >
            <span className="mr-2">{showName ? showName : 'Enter book Name'}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 ml-2 -mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {open && (
            <div
              id="dropdown-menu"
              className="absolute overflow-scroll w-full max-h-[300px] min-w-[300px] right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 pl-4 space-y-2"
            >
              <input
                id="search-input"
                className="block border-2 w-full px-4 py-2 text-gray-800 rounded-md border-gray-300 focus:outline-none"
                type="text"
                placeholder="Search items"
                autoComplete="off"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
              />

              {filterBooks.length > 0 ? (
                filterBooks.map((book) => (
                  <p
                    key={book.reg_no}
                    onClick={() => handleChange(book)}
                    className="cursor-pointer transition-all duration-200 hover:bg-slate-200 p-2 rounded-sm"
                  >
                    {book.name}
                  </p>
                ))
              ) : (
                <p className="text-gray-500 p-2">No matching books found</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CategorySearch;
