import "./App.css";
import "./Components/Login.css";
import "./Components/Navbar.css";
import Dashboard from "./Components/BookEdit";
import { useState, useEffect } from "react";
import axios from "axios";
import React, { useMemo, useRef } from "react";
import { MaterialReactTable } from "material-react-table";
import satyamev from "./satyamev.png"
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  Timestamp,
  and,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Dialog } from "@mui/material";
import Papa from "papaparse";
import logoLogin from "./login_logo1.png";

import browserLang from "browser-lang";
import logo from "./Police_logo.png";
import CategorySearch from "./Components/CategorySearch";


const supportedLanguages = ["en", "mr"];

function App() {

  const [tab, setTab] = useState("home");
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [history, setHistory] = useState([]);
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [allotList, setAllotList] = useState([]);
  const [allotBooksList, setAllotBooksList] = useState([]);
  const [searchAllotId, setSearchAllotId] = useState("");
  const [allotStudentName, setAllotStudentName] = useState("");
  const [addStudentError, setAddStudentError] = useState("");
  const [studentSubmit, setStudentSubmit] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [openStudent, setOpenStudent] = React.useState(false);
  const [openFilter, setOpenFilter] = React.useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [loginState, setLoginState] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

 
  useEffect(() => {
    if (!loginState) {
      setTab("login");
      let user = localStorage.getItem("user");
      if (user) {
        setTab("home");
      }
    }
  }, []);

  var ifBookExists = false;
  var mobileNumberInvalid = true;
  const [studentDetails, setStudentDetails] = useState({
    student_id: "",
    student_name: "",
    student_phone: "",
    student_batch: "",
    student_id_db: "",
  });
  const [bookDetails, setBookDetails] = useState({
    book_id: "",
    book_id_db: "",
    book_name: "",
    book_price: 0,
    book_quantity: 0,
    book_reg : ""
  });
  const [editBookDetails, setEditBookDetails] = useState({
    book_name: "",
    book_reg : "",
    book_price: 0,
    book_quantity: 0,
    book_id_db: "",
  });
  const [editStudentDetails, setEditStudentDetails] = useState({
    student_id: "",
    student_name: "",
    student_phone: "",
    student_batch: "",
    student_id_db: "",
  });


  const [allotDetails, setAllotDetails] = useState({
    studentId: "",  // Match the key names with the data structure
    studentName: "",
    bookId: null,
    bookReg: null,
    bookName: "",
    borrowedDate: 0,
    expectedReturnDate: 0,
    return_status: true,
});


  


// student form onchange

  const handleStudentChange = (e) => {
    if (!studentDetails.student_phone.match(/^(\+\d{1,2}\s)?[6-9]\d{9}$/)) {
      mobileNumberInvalid = false;
    } else {
      mobileNumberInvalid = true;
    }
    

    console.log("check number" , mobileNumberInvalid)
    if (e.target.name === "student_id") {
      if (students.length > 1) {
        const student = students.find(
          (student) => student.student_id === e.target.value
        );
        if (student) {
          setStudentSubmit(false);
          setAddStudentError("Id is taken");
          setStudentDetails((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }));
        } else {
          setStudentSubmit(true);
          if (e.target.value === "") {
            setAddStudentError("");
            setStudentDetails((prev) => ({
              ...prev,
              [e.target.name]: e.target.value,
            }));
          } else {
            setStudentDetails((prev) => ({
              ...prev,
              [e.target.name]: e.target.value,
            }));
          }
        }
      } else {
        setStudentSubmit(true);
        if (e.target.value === "") {
          setAddStudentError("");
          setStudentDetails((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }));
        } else {
          setStudentDetails((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }));
        }
      }
    } else {
      setStudentDetails((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

// book form onchange

  const handleBookChange = (e) => {
    let a = e.target.value[e.target.value.length - 1];
    // if (isNaN(a)) {
    setBookDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // }
  };

  // allot form onchange

  
  function bookExistsance(event) {
    ifBookExists = books.find((book) => book.book_name == event.target.value);
    if (ifBookExists) {
      alert("book exists");
    }
  } 

  // student table 
  const studentTable = () => {
    return students;
  };
  const studentObjects = studentTable();

  // book table 
  const BooksTable = () => {
    console.log("books count " , books)
    return books;
  };
  const bookObjects = BooksTable();

  // allot table
  const AllotTable = () => {
    if (searchAllotId === "") {
      // console.log(history);
      return history;
    } else {
      return history.filter(
        (allot) => allot.student_id === parseInt(searchAllotId)
      );
    }
  };
  const allotObjects = AllotTable();



  const lendingHistory = () => {
    console.log("history array :"  ,history)
    return history;
  };

  var historyObjects = lendingHistory();


  const filterSearchId = (e) => {
    setSearchAllotId(e.target.value);
    let historyArr = [];
    if (e.target.value == "") {
      historyObjects = history;
    } else {
      for (let x of history) {
        if (x.student_id.includes(String(e.target.value))) {
          historyArr.push(x);
        }
      }
      historyObjects = historyArr;
    }
  };

  

  
  
  const allotBook = async (e) => {
    await getDocs(collection(db, "student_list")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      let student = [];
      for (let x of newData) {
        if ("student" in x) {
          student.push(x["student"]);
        } else {
          student.push(x);
        }
      }
      setAllotList(student);
    });
    await getDocs(collection(db, "book_list")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      let books = [];
      for (let x of newData) {
        let obj = x["book"];
        obj["book_id"] = x.id;
        books.push(obj);
      }
      
      setAllotBooksList(books);
    });
  };

  // adding a student 

  const handleStudentSubmit = async (e) => {
    e.preventDefault();

    if (
        studentDetails.student_id !== "" &&
        studentDetails.student_name !== "" &&
        studentDetails.student_phone !== "" &&
        studentDetails.student_batch !== ""
    ) {
        if (!studentDetails.student_phone.match(/^(\+\d{1,2}\s)?[6-9]\d{9}$/)) {
            mobileNumberInvalid = false;
            alert("Enter a valid number");
        } else {
            try {
                console.log("studentDetails before ---->", studentDetails);

                // Make a POST request to your Express server
                const response = await axios.post('http://localhost:5000/student/postStudent', {
                    id: studentDetails.student_id,
                    name: studentDetails.student_name,
                    role: 'student',  // Assuming 'role' is a required field and set it to 'student'
                    phone: studentDetails.student_phone,
                    batch: studentDetails.student_batch,
                });

                console.log('MongoDB API Response:', response.data);

                getStudents();
                setTab("students");
                setStudentDetails({
                    student_id: "",
                    student_name: "",
                    student_phone: "",
                    student_batch: "",
                    student_id_db: "",
                });
            } catch (err) {
                console.error('Error adding student:', err);
                alert("Cannot add student");
            }
        }
    } else {
        alert("Please fill in all form values");
    }
};

  // get student

  const getStudents = async (page = 1) => {
    try {
      const response = await axios.get(`http://localhost:5000/student/getStudent`);
      const students = response.data;
      console.log(students);
  
      setStudents(students);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error appropriately, e.g., show a message to the user
    }
  };

  // delete student  

  const handleDeleteStudent = async (studentId) => {
    try {
      console.log("Deleting student with ID:", studentId);
      if (studentId) {
        // Make an Axios DELETE request to your server endpoint
        const response = await axios.delete(`http://localhost:5000/student/deleteStudent/${studentId}`);
        console.log("Delete response:", response.data);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  
    // After deletion, refresh the list of students
    getStudents();
    setTab("students");
  };

  const handleFieldChange = (fieldName, value) => {
    setEditStudentDetails((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };
  
  // student edit

  const handleEditStudentSubmit = async (studentId) => {
    console.log('handleEditStudentSubmit called');

    try {
        if (studentId) {
            // Make an Axios PUT request to your server endpoint for updating a student
            const response = await axios.put(`http://localhost:5000/student/updateStudent/${studentId}`, {
                // Assuming editStudentDetails is an object with updated student details
                id:editStudentDetails.student_id,
                name: editStudentDetails.student_name,
                phone: editStudentDetails.student_phone,
                batch: editStudentDetails.student_batch,
            });

            console.log('Update response:', response.data);
            
            // After updating, refresh the list of students
            getStudents();
            setTab("students");
            setOpenStudent(false);
        }
    } catch (error) {
        console.error('Error updating student:', error);
    }
};

  // student onchange

  const handleEditStudent = async (studentId) => {
    try {
      // Make a request to fetch the student details by their ID
      const response = await fetch(`http://localhost:5000/student/getId/${studentId}`);
      const studentData = await response.json();
      
      if (response.ok) {
        // Check if the student data is not empty
        if (studentData) {
          // Open the edit dialog and set the editStudentDetails
          setOpenStudent(true);
          setEditStudentDetails({
            student_id: studentData.id,
            student_name: studentData.name,
            student_phone: studentData.phone,
            student_batch: studentData.batch,
            // Add other fields as needed
          });
        } else {
          console.error('Student not found with ID:', studentId);
        }
      } else {
        // Handle error if the request was not successful
        console.error('Failed to fetch student details:', studentData);
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };
  
  // student column
  
  

  const studentColumns = useMemo(
    () => [
      {
        accessorKey: 'actions',
        header: 'Actions',
        Cell: ({ row }) => (
          <div>
            <button onClick={() => handleEditStudent(row.original.id)}>
              Edit
            </button>
            <br />
            <button onClick={() => handleDeleteStudent(row.original.id)}>
              Delete
            </button>
          </div>
        ),
      },
      {
        accessorKey: "id", //simple recommended way to define a column
        header: "Student ID",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "name", //simple recommended way to define a column
        header: "Name",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "phone", //simple recommended way to define a column
        header: "Phone",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "batch", //simple recommended way to define a column
        header: "Batch",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      }
    ],
    []
  );
  
  // get books

  const getBooks = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/book/getBook`);
      const books = response.data;
      console.log(books);
  
      setBooks(books);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error appropriately, e.g., show a message to the user
    }
  };

  // add books

  const handleBookSubmit = async (e) => {
    e.preventDefault();

    if (
        bookDetails.name !== "" &&
        bookDetails.reg_no !== "" &&
        bookDetails.price !== "" &&
        bookDetails.quantity !== ""
    ) {
        try {
            console.log("bookDetails before ---->", bookDetails);

            // Make a POST request to your Express server for adding a book
            const response = await axios.post('http://localhost:5000/book/postBook', {
                name: bookDetails.book_name,
                reg_no: bookDetails.book_reg,
                price: bookDetails.book_price,
                quantity: bookDetails.book_quantity,
            });

            console.log('MongoDB API Response:', response.data);

            getBooks(); // Assuming getBooks is a function to fetch and update the book list
            setTab("books");
            setBookDetails({
                book_name: "",
                book_reg: "",
                book_price: "",
                book_quantity: "",
            });
        } catch (err) {
            console.error('Error adding book:', err);
            alert("Cannot add book");
        }
    } else {
        alert("Please fill in all form values");
    }
};

// delete a book

const deleteBook = async (reg_no) => {
  try {

    // Make an Axios DELETE request to your server endpoint for deleting a book
    const response = await axios.delete(`http://localhost:5000/book/deleteBook/${reg_no}`);

    console.log('Delete Book response:', response.data);

    // After deleting, refresh the list of books or perform any other necessary actions
    // (e.g., updating state, re-fetching data)
    getBooks();
    setTab("books");
  } catch (error) {
    console.error('Error deleting book:', error);
  }
};


// onchange for book

const handleEditBookChange = (e) => {
  const { name, value } = e.target;
  setEditBookDetails((prevDetails) => ({
    ...prevDetails,
    [name]: value,
  }));
};

// edit submission

const handleEditBookSubmit = async (reg_no) => {
  console.log('handleBookSubmit called');

  try {
    if (reg_no) {
      // Make an Axios PUT request to your server endpoint for updating a book
      const response = await axios.put(`http://localhost:5000/book/updateBook/${reg_no}`, {
        // Assuming editBookDetails is an object with updated book details
        name: editBookDetails.book_name,
        price: editBookDetails.book_price,
        quantity: editBookDetails.book_quantity,
      });

      console.log('Update response:', response.data);

      getBooks();
      setTab("books");
      setOpen(false);

      // After updating, refresh the list of books or perform any other necessary actions
      // For example, you might call a function like getBooks() to update the book list.
    }
  } catch (error) {
    console.error('Error updating book:', error);
  }
};


// diaglog box getting for edit


const handleEditBook = async (reg_no) => {
  try {
    // Make a request to fetch the book details by registration number
    const response = await fetch(`http://localhost:5000/book/getBook/${reg_no}`);
    const bookData = await response.json();

    if (response.ok) {
      // Check if the book data is not empty
      if (bookData) {
        // Open the edit dialog and set the editBookDetails
        setOpen(true);
        setEditBookDetails({
          book_reg: bookData.reg_no,
          book_name: bookData.name,
          book_price: bookData.price,
          book_quantity: bookData.quantity,
          // Add other fields as needed
        });
      } else {
        console.error('Book not found with registration number:', reg_no);
      }
    } else {
      // Handle error if the request was not successful
      console.error('Failed to fetch book details:', bookData);
    }
  } catch (error) {
    console.error('Error fetching book details:', error);
  }
};



// Book columns

  const bookColumns = useMemo(
    () => [
      {
        accessorKey: 'actions',
        header: 'Actions',
        Cell: ({ row }) => (
          <div>
          <button  onClick={() =>handleEditBook(row.original.reg_no)}>
            Edit
          </button>
          <br />
            <button onClick={() => deleteBook(row.original.reg_no)}>
              Delete
            </button>
          </div>
        ),
      },
      
      {
        accessorKey: 'reg_no', //simple recommended way to define a column
        header: 'Reg No',
        muiTableHeadCellProps: { sx: { color: 'green' } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "name", //simple recommended way to define a column
        header: "Name",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "price", //simple recommended way to define a column
        header: "Price",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "quantity", //simple recommended way to define a column
        header: "Quantity",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "available", //simple recommended way to define a column
        header: "Available Quantity",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
    ],
    []
  );


 
  // get allot history


  const getHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/allot/getAllot`);
      const allots = response.data;

      setHistory(allots);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error appropriately, e.g., show a message to the user
    }
  };
  
  
  // change the return status



  const handleAllotSubmit = async (e) => {
    e.preventDefault();
    
    // Assuming you have a similar state for allotment details
    if (
      allotDetails.studentId !== "" &&
      allotDetails.studentName !== "" &&
      allotDetails.bookName !== "" &&
      allotDetails.bookId !== "" &&
      allotDetails.borrowedDate !== "" &&
      allotDetails.expectedReturnDate !== ""
      ) {
        try {
          // Make a POST request to your Express server
          const response = await axios.post('http://localhost:5000/allot/postAllotBook', {
            studentId: allotDetails.studentId,
            studentName: allotDetails.studentName,
            bookName: allotDetails.bookName,
            bookId: allotDetails.bookId,
            borrowedDate: allotDetails.borrowedDate,
            expectedReturnDate: allotDetails.expectedReturnDate,
            return_status: allotDetails.return_status,
          });
          
          console.log('MongoDB API Response:', response.data);
  
          getHistory(); // Assuming this function fetches the latest allotment history
          alert('Allot done with sucess');
          setTab("history");
          setAllotDetails({
            studentId: "",
            studentName: "",
            bookName: "",
            bookId: "",
            borrowedDate: "",
            expectedReturnDate: "",
          });
        } catch (err) {
          console.error('Error adding allotment:', err);
          alert("Cannot add allotment");
        }
      } else {
        alert("Please fill in all form values");
      }
    };
    

    const handleStudentIdChange = async (enteredStudentId) => {
      setAllotDetails({ ...allotDetails, studentId: enteredStudentId });
    
      if (enteredStudentId) {
        try {
          // Make an API call to fetch student details based on the ID
          const response = await axios.get(`http://localhost:5000/student/getId/${enteredStudentId}`);
          const student = response.data;
    
          // Update the state with the fetched student name
          setAllotDetails((prevDetails) => ({
            ...prevDetails,
            studentName: student ? student.name : "", // Set to an empty string if student not found
          }));
        } catch (error) {
          console.error('Error fetching student details:', error);
        }
      } else {
        // Clear the studentName if the entered ID is empty
        setAllotDetails((prevDetails) => ({ ...prevDetails, studentName: "" }));
      }
    };


    const handleBookNameChange = async (enteredBookName) => {
      setAllotDetails({ ...allotDetails, bookName: enteredBookName });
    
      if (enteredBookName) {
        try {
          // Make an API call to fetch book details based on the name
          const response = await axios.get(`http://localhost:5000/book/getBookByName/${enteredBookName}`);
          const book = response.data;
    
          // Update the state with the fetched book ID
          setAllotDetails((prevDetails) => ({
            ...prevDetails,
            bookId: book ? book.reg_no : "", // Set to null if book not found
          }));
        } catch (error) {
          console.error('Error fetching book details:', error);
        }
      } else {
        // Clear the bookId if the entered name is empty
        setAllotDetails((prevDetails) => ({ ...prevDetails, bookId: null }));
      }
    };



    const handleChangeReturnStatus = async (studentId) => {
      try {
        // Assuming selectedStatus is a boolean value
        const selectedStatus = allotDetails.return_status === "true"; // Convert to boolean
        
        await axios.put(`http://localhost:5000/allot/updateAllotByBookId/${studentId}`, {
          return_status: selectedStatus,
        });
    
        // Update the state with the modified return_status
        setAllotDetails((prevDetails) => ({
          ...prevDetails,
          return_status: selectedStatus,
        }));
    
        // Fetch the updated history after the return_status is updated
        getHistory();
    
        // Trigger a re-render by setting the tab
        setTab("history");
        
        alert("Update done");
      } catch (error) {
        console.error('Error updating return status:', error);
      }
    };
    
    




const historyColumns = useMemo(
    () => [
      {
        accessorKey: "studentId", //simple recommended way to define a column
        header: "ID",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "studentName", //simple recommended way to define a column
        header: "Student Name",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "bookName", //simple recommended way to define a column
        header: "Book Name",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "borrowedDate", //simple recommended way to define a column
        header: "Borrowed Date",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "expectedReturnDate", //simple recommended way to define a column
        header: "Expected Return Date",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "return_status", //simple recommended way to define a column
        header: "Return Status",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        // Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
        Cell: ({ cell }) => {
          return (
            <select
              name={cell.row.original.id}
              value={cell.getValue()}
              
              onChange={(e) => handleChangeReturnStatus(cell.row.original.studentId)}
            >

              <option value="true">Returned</option>
              <option value="false">Pending</option>
            </select>
          );
        },
      },
    ],
    [history]
  );

  const [rowSelection, setRowSelection] = useState({});

  // useEffect(() => {}, [rowSelection]);

  const bookTableInstanceRef = useRef(null);

 

  function handleClose() {
    setOpen(false);
  }

  function handleCloseStudent() {
    setOpenStudent(false);
  }

  const handleCSVUpload = async (e) => {
    const files = e.target.files;
    let name = e.target.name;
    console.log(name);
    if (name == "student") {
      if (files) {
        Papa.parse(files[0], {
          complete: async function (result) {
            let count = 0;
            for (let x of result.data) {
              count = count + 1;
              let obj = {};
              if (count >= 1 && x.length >= 1) {
                obj.student_id = x[0];
                obj.student_name = x[1];
                obj.student_phone = x[2];
                obj.student_batch = x[3];
                const studentSubmit = await addDoc(
                  collection(db, "student_list"),
                  {
                    student: obj,
                  }
                );
              }
            }
            e.target.value = null;
            getStudents();
            setTab("students");
          },
        });
      }
    }
    if (name == "book") {
      if (files) {
        Papa.parse(files[0], {
          complete: async function (result) {
            let count = 0;

            console.log("book list ", result.data);

            if (
              typeof result.data[0][0] !== "string" ||
              typeof result.data[0][1] !== "string" ||
              typeof result.data[0][2] !== "string" ||
              typeof result.data[0][3] !== "string" 
            ) {
              console.log("invalid file");
            } else {
              for (let x of result.data) {
                count = count + 1;
                let obj = {};
                if (count >= 1 && x.length >= 1) {
                  obj.book_name = x[0];
                  obj.book_reg = x[1];
                  obj.book_price = x[2];
                  obj.book_quantity = x[3];
                  const studentSubmit = await addDoc(
                    collection(db, "book_list"),
                    {
                      book: obj,
                    }
                  );
                }
              }

              e.target.value = null;
              getBooks();
              setTab("books");
            }
          },
        });
      }
    }
  };

  const getStudentsDownlaod = async (e) => {
    
    const collectionRef = collection(db, "allot_list");

    let start = startDate ? new Date(startDate).getTime() : new Date(0).getTime();
    let end = endDate ? new Date(endDate).getTime() : new Date().getTime() + 31536000000;
  
    const q = query(
      collectionRef,
      where("allot.expected_return_date", ">=", start),
      where("allot.expected_return_date", "<=", end)
    );
  
    const querySnapshot = await getDocs(q);
  
    const newData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  
    let csvContent = "Student ID,Student Name,Book Name,Borrowed Date,Expected Return Date,Return Status\n";
  
    newData.forEach((record) => {
      let borrowedDate = new Date(record.allot.borrowed_date).toLocaleDateString();
      let returnDate = new Date(record.allot.expected_return_date).toLocaleDateString();
  
      let csvRow = [
        record.allot.student_id,
        record.allot.student_name,
        record.allot.book_name,
        borrowedDate,
        returnDate,
        record.allot.return_status,
      ].join(",");
  
      csvContent += csvRow + "\n";
    });
  
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
  
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
  };

  const setSDate = (e) => {
    setStartDate(e.target.value);
  };

  const setEDate = (e) => {
    setEndDate(e.target.value);
  };

  const log = async (e) => {
    console.log(history);
    let obj = history.find((o) => o.id === e.target.name);
    if (obj) {
      obj.return_status = e.target.value === "true";
      const docRef = doc(db, "allot_list", obj.id);
      obj.borrowed_date = new Date(obj.borrowed_date).getTime();
      obj.expected_return_date = new Date(obj.expected_return_date).getTime();
      const editDoc = await updateDoc(docRef, {
        allot: obj,
      });
      getHistory();
    }
  };

  function openFilterDialog() {
    setOpenFilter(true);
  }

  function closeFilter(apply = false) {
    setOpenFilter(false);
  }
  const LoginFun = () => {
    let username = "admin";
    let password = "admin@123";

    const login = (event) => {
      event.preventDefault();
      if (
        event.target.elements.username.value == username &&
        event.target.elements.password.value == password
      ) {
        setLoginState(true);
        setTab("home");
        localStorage.setItem("user", event.target.elements.username.value);
      }
    };

    

    return (

    <div className="flex justify-center items-center h-full ">
    <div className="flex flex-col items-center justify-between border shadow-2xl w-full max-w-md p-6 md:w-96 bg-white rounded-lg">
      <div className="flex flex-row items-center mb-4">
      <img src={logo} className="p-2 h-16 xs:h-16 sm:h-20 lg:h-20 mr-6" alt="Logo 1" />
      <img src={logoLogin} className="p-1 h-16 xs:h-16  sm:h-20 lg:h-22" alt="Logo 2" />
      </div>
      <form onSubmit={login} className="login w-full">
        <div className="input-field mb-1">
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter your user name"
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="input-field mb-4">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="mr-2"
              />
              <label htmlFor="showPassword">Show Password</label>
            </div>
        <div className="input-field">
          <button type="submit" className="w-full bg-blue-900 text-white px-4 py-2 rounded-md">
            Log in
          </button>
        </div>
        <p className="text-center text-base px-4 py-2">or</p>
        <div className="input-field mb-4">
          <button type="button" className="w-full bg-blue-900 text-white px-4 py-2 rounded-md" onClick={() => window.open('http://elibrary-ptcnanveej-daund.vercel.app', '_blank')}>
            Enter to E-Library
          </button>
        </div>
      </form>
    </div>
  </div>
  



    );
  };

  const Navbar = () => {
    const logout = () => {
      setLoginState(false);
      setTab("login");
      localStorage.removeItem("user");
    };

    return (
      <div id="navbar_container " className="bg-[#0d028d] w-full h-20  flex flex-row items-center justify-between gap-3 px-6">
       <div className="flex flex-row  items-center gap-4">
         <img src={logo} className="w-14 h-10"/>
         <h2 className="text-xl  tracking-wider font-bold  text-white ">
            PTC Nanveej-Daund-LMS{" "}
          </h2>
          <img src={logoLogin}  className="w-14 h-12 "
        />
        
       </div>

       <div className="flex flex-row">
        <img src={satyamev}  className="w-14 h-12 mr-5 "
        />
          <button id={tab === "login" ? "no_display" : "logout"} onClick={logout} className="text-black rounded-md bg-white transition-all duration-700 border-2 hover:scale-105 border-white  px-8 h-11 font-semibold hover:text-white hover:bg-[#0d028d]">
            Logout
          </button>
       </div>
      </div>
    );
  };
  
  
  return (
    <>
      <Navbar />

      <div className="flex flex-row flex items-center justify-center h-full rounded-md">
        {tab !== "login" && (
          <div id="sidebar" className="h-full rounded-md">
            <div
              id={tab === "login" ? "no_display" : "sidebar_option"}
              onClick={() => [setTab("home")]}
              className={` ${tab === "home" ? "bg-white !text-black" : "" }`}
            >
              Dashboard
            </div>
            <div
              id={tab === "login" ? "no_display" : "sidebar_option"}
              onClick={() => [getStudents(), setTab("student_add_type")]}
              className={` ${tab === "student_add_type" ? "bg-white !text-black" : "" }`}
            >
              Add a Student
            </div>
            <div
              id={tab === "login" ? "no_display" : "sidebar_option"}
              onClick={() => [getStudents(), setTab("students")]}
              className={` ${tab === "students" ? "bg-white !text-black" : "" }`}
            >
              Students List
            </div>
            <div
              id={tab === "login" ? "no_display" : "sidebar_option"}
              onClick={() => [setTab("book_add_type"), getBooks()]}
              className={` ${tab === "book_add_type" ? "bg-white !text-black" : "" }`}
            >
              Add a Book
            </div>
            <div
              id={tab === "login" ? "no_display" : "sidebar_option"}
              onClick={() => [getBooks(), setTab("books")]}
              className={` ${tab === "books" ? "bg-white !text-black" : "" }`}
            >
              Books List
            </div>
            <div
              id={tab === "login" ? "no_display" : "sidebar_option"}
              onClick={() => [allotBook(), setTab("allot_book")]}
              className={` ${tab === "allot_book" ? "bg-white !text-black" : "" }`}
            >
              Allot a book   
             
            </div>
            <div
              id={tab === "login" ? "no_display" : "sidebar_option"}
              onClick={() => [getHistory(), setTab("history")]}
              className={` ${tab === "history" ? "bg-white !text-black" : "" }`}
            >
              Book Lending History
            </div>
          </div>
        )}
        <div id="main_container">
          <div id={tab === "login" ? "login_display" : "no_display"}>
            <LoginFun></LoginFun>
          </div>
          <div id={tab === "home" ? "db_display" : "no_display"}>
            <Dashboard
              studentDetails={studentDetails}
              bookDetails={bookDetails}
              allotDetails={allotDetails}
            />
           
          </div>
          <div id={tab === "students" ? "display" : "no_display"}>
            <div id="students_table_container" style={{ marginTop: "4%" }}>
              <MaterialReactTable
                columns={studentColumns}
                data={studentObjects}
                enableColumnOrdering //enable some features
                enablePagination={true} //disable a default feature //get a reference to the underlying table instance (optional)
              />
            </div>
          </div>
          <div id={tab === "books" ? "display" : "no_display"}>
            <div id="students_table_container" style={{ marginTop: "4%" }}>
              <MaterialReactTable
                columns={bookColumns}
                data={bookObjects}
                enableColumnOrdering //enable some features
                enablePagination={true}
              />
            </div>
          </div>

          <Dialog open={open}>
            <DialogContent>
              <DialogContentText>Edit Book</DialogContentText>
              <br></br>
              <div>
                <TextField
                  fullWidth
                  type="text"
                  id="outlined_basic"
                  label="Book Name"
                  name="book_name"
                  value={editBookDetails.book_name}
                  onChange={handleEditBookChange}
                ></TextField>
              </div>
              <br></br>
              <div>
                <TextField
                  fullWidth
                  id="outlined_basic"
                  label="Book Price"
                  type="number"
                  name="book_price"
                  value={editBookDetails.book_price}
                  onChange={handleEditBookChange}
                ></TextField>
              </div>
              <br></br>
              <div>
                <TextField
                  fullWidth
                  type="number"
                  name="book_quantity"
                  id="outlined_basic"
                  label="Book Quantity"
                  value={editBookDetails.book_quantity}
                  onChange={handleEditBookChange}
                ></TextField>
              </div>
              <br></br>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={() => handleEditBookSubmit(editBookDetails.book_reg)}>Edit</Button>
              </DialogActions>
            </DialogContent>
          </Dialog>

          <Dialog open={openStudent}>
            <DialogContent>
              <DialogContentText>Edit Student</DialogContentText>
              <br></br>
              <div>
                <TextField
                  fullWidth
                  type="number"
                  id="outlined_basic"
                  label="Student ID"
                  name="student_id"
                  value={editStudentDetails.student_id}
                  onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                >
                  Student ID
                </TextField>
              </div>
              <br></br>
              <div>
                <TextField
                  fullWidth
                  type="text"
                  name="student_name"
                  id="outlined_basic"
                  label="Student Name"
                  value={editStudentDetails.student_name}
                  onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                ></TextField>
              </div>
              <br></br>
              <div>
                <TextField
                  fullWidth
                  type="text"
                  name="student_phone"
                  id="outlined_basic"
                  label="Student Phone"
                  value={editStudentDetails.student_phone}
                  onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                ></TextField>
              </div>
              <br></br>
              <div>
                <TextField
                  fullWidth
                  type="text"
                  name="student_batch"
                  id="outlined_basic"
                  label="Student Batch"
                  value={editStudentDetails.student_batch}
                  onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                ></TextField>
              </div>
              <br></br>
              <DialogActions>
                <Button onClick={handleCloseStudent}>Cancel</Button>
                <Button onClick={() => handleEditStudentSubmit(editStudentDetails.student_id)}>Edit</Button>
              </DialogActions>
            </DialogContent>
          </Dialog>

          <Dialog open={openFilter}>
            <DialogContent>
              <DialogContentText>Apply Filter</DialogContentText>
              <br></br>
              <div className="filter_input">
                <p className="filter-para">Start Date:</p>
                <TextField
                  onChange={setSDate}
                  type="date"
                  placeholder="Start Date"
                >
                  Start Date
                </TextField>
              </div>
              <br></br>
              <div className="filter_input">
                <p className="filter-para">End Date:</p>
                <TextField
                  onChange={setEDate}
                  type="date"
                  placeholder="Start Date"
                >
                  End Date
                </TextField>
              </div>
              <br></br>
              <DialogActions>
                <Button onClick={() => closeFilter(false)}>Cancel</Button>
                <Button onClick={() => getHistory(true)}>Apply</Button>
              </DialogActions>
            </DialogContent>
          </Dialog>

          <div
            id={tab === "history" ? "display" : "no_display"}
            style={{ marginTop: "4%" }}
          >
            <div className="inputs">
              <button className="filter_button" onClick={getStudentsDownlaod}>
                Download Report
              </button>
              <button
                className="filter_button"
                onClick={() => openFilterDialog()}
              >
                Apply Filter
              </button>
              <input
                type="number"
                placeholder="Search Student ID"
                value={searchAllotId}
                onChange={filterSearchId}
              />
            </div>
            <div id="students_table_container">
              <MaterialReactTable
                columns={historyColumns}
                data={historyObjects}
                enableColumnOrdering={true}
                enableRowSelection={true}
                enableSelectAll={true}
                enableMultiRowSelection={true}
                enablePagination={true}
                onRowSelectionChange={setRowSelection}
                state={{ rowSelection }}
                tableInstanceRef={bookTableInstanceRef}
              />
            </div>
          </div>
          <div
            id={tab === "add_student" ? "display" : "no_display"}
            style={{ marginTop: "4%" }}
          >
            {/* student details */}
            <form id="form">
              <div style={{ marginTop: "5%" }}>
                <label for="name">Student ID</label>
                <input
                  required
                  type="number"
                  name="student_id"
                  placeholder="Student ID"
                  value={studentDetails.student_id}
                  onChange={handleStudentChange}
                />
                {/*<p
                  style={{
                    marginLeft: "5%",
                    marginBottom: "0",
                    marginTop: "0",
                  }}
                  id="student_error"
                >
                  {addStudentError}
                </p>*/}
              </div>
              <div style={{ marginTop: "5%" }}>
                <label for="name">Student Name</label>
                <input
                  required
                  type="text"
                  name="student_name"
                  placeholder="Name"
                  value={studentDetails.student_name}
                  onChange={handleStudentChange}
                />
              </div>
              <div style={{ marginTop: "5%" }}>
                <label for="name">Student Phone</label>
                <input
                  required
                  type="tel"
                  pattern="[0-9]{3} [0-9]{3} [0-9]{4}"
                  maxlength="10"
                  minLength="10"
                  name="student_phone"
                  placeholder="Phone No"
                  value={studentDetails.student_phone}
                  onChange={handleStudentChange}
                />
                <p
                  style={{ display: mobileNumberInvalid ? "none" : "block" }}
                  id="student_error"
                >
                  Invalid Number
                </p>
              </div>
              <div style={{ marginTop: "5%" }}>
                <label for="name">Student Batch</label>
                <input
                  required
                  type="text"
                  name="student_batch"
                  placeholder="Batch No"
                  value={studentDetails.student_batch}
                  onChange={handleStudentChange}
                />
              </div>
              <Button
                id="submit"
                disabled={!studentSubmit}
                onClick={handleStudentSubmit}
              >
                Submit
              </Button>
            </form>
          </div>
          <div
            id={tab === "add_book" ? "display" : "no_display"}
            style={{ marginTop: "4%" }}
          >
            <form id="form">
              <div style={{ marginTop: "5%" }}>
                <label for="name">Book Name</label>
                <input
                  required
                  type="text"
                  name="book_name"
                  placeholder="Name"
                  value={bookDetails.book_name}
                  onChange={handleBookChange}
                  onInput={bookExistsance}
                />
              </div>

              <div style={{ marginTop: "5%" }}>
                <label for="name">Book Register number</label>
                <input
                  required
                  type="text"
                  name="book_reg"
                  placeholder="Enter a number"
                  value={bookDetails.book_reg}
                  onChange={handleBookChange}
                  onInput={bookExistsance}
                />
              </div>
              <div style={{ marginTop: "5%" }}>
                <label for="name">Book Price</label>
                <input
                  required
                  type="number"
                  name="book_price"
                  value={bookDetails.book_price}
                  placeholder="Price"
                  onChange={handleBookChange}
                />
              </div>
              <div style={{ marginTop: "5%" }}>
                <label for="name">Book Quantity</label>
                <input
                  required
                  type="number"
                  name="book_quantity"
                  value={bookDetails.book_quantity}
                  placeholder="Quantity"
                  onChange={handleBookChange}
                />
              </div>
              <button id="submit" onClick={handleBookSubmit}>
                Submit
              </button>
            </form>
          </div>
          <div
            id={tab === "allot_book" ? "display" : "no_display"}
            style={{ marginTop: "4%" }}
          >
            <form id="form">
              <div style={{ marginTop: "5%" }}>
                <label for="name">Student ID</label>
                <input
                  type="number"
                  name="studentId"
                  placeholder="Student ID"
                  value={allotDetails.studentId}
                  onChange={(e) => handleStudentIdChange(e.target.value)}
                />
              </div>
              <div style={{ marginTop: "5%" }}>
                <label for="name">Student Name</label>
                <input
                  type="text"
                  name="studentName"
                  placeholder="Student Name"
                  value={allotDetails.studentName}
                  readOnly
                />
              </div>
              <div style={{ marginTop: "5%" }}>
                <label for="name">Book Name</label>
                <CategorySearch allotBooksList={allotBooksList} handleAllotChange={handleBookNameChange}  />

                {/*<input
                  type="text"
                  name="bookName"
                  placeholder="Book Name"
                  value={allotDetails.bookName}
                  onChange={(e) => handleBookNameChange(e.target.value)}
              />*/}

              </div>

              <div style={{ marginTop: "5%" }}>
                <label for="name">Book id</label>
                <input
                  type="number"
                  name="bookId"
                  placeholder="Book register id"
                  value={allotDetails.bookId}
                  readOnly
                />
              </div>
              <div style={{ marginTop: "5%" }}>
                <label for="name">Borrowed Date</label>
                <input
                  type="date"
                  name="borrowedDate"
                  placeholder="Borrowed Date"
                  value={allotDetails.borrowedDate}
                  onChange={(e) => {
                    setAllotDetails({ ...allotDetails, borrowedDate: e.target.value });
                  }}
                />
              </div>
              <div style={{ marginTop: "5%" }}>
                <label for="name">Expected Return Date</label>
                <input
                  type="date"
                  name="expectedReturnDate"
                  placeholder="Return Date"
                  value={allotDetails.expectedReturnDate}
                  onChange={(e) => {
                    setAllotDetails({ ...allotDetails, expectedReturnDate: e.target.value });
                  }}
                />
              </div>
              <button
                id="submit"
                onClick={handleAllotSubmit}
              >
                Submit
              </button>
            </form>
          </div>
          <div
            id={tab === "student_add_type" ? "display_add" : "no_display"}
            style={{ height: "inherit" }}
          >
            <div className="add_type">
              <div className="add_button">
                <button className="adding_button"onClick={() => setTab("add_student")}>
                  Add a student
                </button>
              </div>
              <div className="add_button">
                <button onClick={() => setTab("add_student_bulk")}>
                  Bulk Upload
                </button>
              </div>
            </div>
          </div>
          <div
            id={tab === "book_add_type" ? "display_add" : "no_display"}
            style={{ height: "inherit" }}
          >
            <div className="add_type">
              <div className="add_button">
                <button className="bg-black" onClick={() => setTab("add_book")}>Add a book</button>
              </div>
              <div className="add_button">
                <button onClick={() => setTab("add_book_bulk")}>
                  Bulk Upload
                </button>
              </div>
            </div>
          </div>
          <div
            id={tab === "add_student_bulk" ? "display_add" : "no_display"}
            style={{ height: "inherit" }}
          >
            <div className="bulk_button">
              <p>Please upload the csv file</p>
              <div>
                <input
                  className="custom-file-input"
                  name="student"
                  accept="csv"
                  onChange={handleCSVUpload}
                  type="file"
                ></input>
              </div>
            </div>
          </div>
          <div
            id={tab === "add_book_bulk" ? "display_add" : "no_display"}
            style={{ height: "inherit" }}
          >
            <div className="bulk_button">
              <p>Please upload the csv file</p>
              <div>
                <input
                  className="custom-file-input"
                  name="book"
                  accept="csv"
                  onChange={handleCSVUpload}
                  type="file"
                ></input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
