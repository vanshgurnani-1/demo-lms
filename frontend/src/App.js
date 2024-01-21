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
    book_name: "",
    book_price: 0,
    book_quantity: 0,
    book_reg : 0
  });
  const [editBookDetails, setEditBookDetails] = useState({
    book_id: "",
    book_name: "",
    book_price: 0,
    book_quantity: 0,
  });
  const [editStudentDetails, setEditStudentDetails] = useState({
    student_id: "",
    student_name: "",
    student_phone: "",
    student_batch: "",
    student_id_db: "",
  });
  const [allotDetails, setAllotDetails] = useState({
    student_id: "",
    student_name: "",
    book_id: null,
    book_reg : null ,
    book_name: "",
    borrowed_date: 0,
    expected_return_date: 0,
    return_status: false,
  });

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
            setAddStudentError("Id is not taken");
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
          setAddStudentError("Id is not taken");
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
  const handleBookChange = (e) => {
    let a = e.target.value[e.target.value.length - 1];
    // if (isNaN(a)) {
    setBookDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // }
  };
  const handleAllotChange = (e) => {
    if (e?.target?.name === "student_id") {
      const temp = allotList.filter(
        (student) => student.student_id === e.target.value
      );
      if (temp[0]) {
        setAllotStudentName(temp[0].student_name);
        setAllotDetails((prev) => ({
          ...prev,
          student_name: temp[0].student_name,
        }));
      } else if (e.target.value === "") {
        setAllotStudentName("");
      } else {
        setAllotStudentName("No student with Id " + e.target.value);
      }
    } else if (e.target.name === "book_id") {
      const temp2 = allotBooksList.filter(
        (book) => book.book_id === e.target.value
      );
      setAllotDetails((prev) => ({ ...prev, book_name: temp2[0].book_name , book_reg : temp2[0].book_reg }));
    }
    
  
    setAllotDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleReturnChange = (e) => {};

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
        alert("Enter valid number")
      } else {
        try {
          console.log("studentDetails before ---->", studentDetails);
          const studentSubmit = await addDoc(collection(db, "student_list"), {
            student: studentDetails,
          });
          console.log("studentDetails after ---->", studentDetails);
          getStudents();
          setTab("students");
          setStudentDetails({
            student_id: "",
            student_name: "",
            student_phone: "",
            student_batch: "",
            student_id_db: "",
          });

          // debugger;
        } catch (err) {
          alert("Cannot add student");
        }
      }
    } else {
      alert("Please fill all form values");
    }
  };
  function bookExistsance(event) {
    ifBookExists = books.find((book) => book.book_name == event.target.value);
    if (ifBookExists) {
      alert("book exists");
    }
  }
  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      if (books.length > 1) {
        let ifBookExists = books.find(
          (o) => o.book_name == bookDetails.book_name
        );
        if (!ifBookExists) {
          const bookSubmit = await addDoc(collection(db, "book_list"), {
            book: bookDetails,
          });
          if (bookSubmit.id != null) {
            setBookDetails({
              book_name: "",
              book_price: 0,
              book_quantity: 0,
            });
          }
        } else {
          alert("Book Exists");
        }
      } else {
        const bookSubmit = await addDoc(collection(db, "book_list"), {
          book: bookDetails,
        });
        if (bookSubmit.id != null) {
          setBookDetails({
            book_name: "",
            book_price: 0,
            book_quantity: 0,
          });
        }
      }
      getBooks();
      setTab("books");
    } catch (err) {
      alert("Cannot add Book");
    }
  };
  const handleAllotSubmit = async (e) => {
    e.preventDefault();
    allotDetails.borrowed_date = new Date(allotDetails.borrowed_date).getTime();
    allotDetails.expected_return_date = new Date(
      allotDetails.expected_return_date
    ).getTime();
    try {
      const allocatSubmit = await addDoc(collection(db, "allot_list"), {
        allot: allotDetails,
      });
      if (allocatSubmit.id != null) {
        alert("Book alloted");
        setAllotDetails({
          student_id: "",
          student_name: "",
          book_id: null,
          book_name: "",
          borrowed_date: "",
          expected_return_date: "",
        });
        setAllotStudentName("");
        getHistory();
        setTab("history");
      }
    } catch (err) {
      alert("Cannot allocate book");
    }
  };
  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://lms-backend-eight.vercel.app/return_book",
        returnedBooks
      );
      if (res.data) {
        getHistory();
      }
    } catch (err) {}
  };

  const studentTable = () => {
    return students;
  };
  const studentObjects = studentTable();

  const BooksTable = () => {
    console.log("books count " , books)
    return books;
  };
  const bookObjects = BooksTable();

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

  function dateString(dateObj) {
    let month = dateObj.getUTCMonth() + 1; //months from 1-12
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();

    let newdate = day + "/" + month + "/" + year;
    return newdate;
  }

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

  const getStudents = async (e) => {
    await getDocs(collection(db, "student_list")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      let student = [];
      for (let x of newData) {
        let obj = x["student"];
        obj["student_id_db"] = x.id;
        student.push(obj);
      }
      setStudents(student);
    });
  };
  const addBook = async (e) => {
    console.log("before add book ");
    await getDocs(collection(db, "book_list")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      let books = [];
      for (let x of newData) {
        books.push(x["book"]);
      }
      setBooks(books);
    });

    console.log("after add books");
  };
  const getBooks = async (e) => {
    getHistory();
    let obj_arr = [];
    for (let x of history) {
      let obj = { book: "", number: 0 };
      if (obj_arr.length > 0) {
        if (obj_arr.find((o) => o.book === x.book_name)) {
          let index = obj_arr.findIndex((o) => o.book === x.book_name);
          if (!x.return_status) {
            obj_arr[index].number = obj_arr[index].number - 1;
          }
        } else {
          obj.book = x.book_name;
          if (!x.return_status) {
            obj.number = -1;
          }
          obj_arr.push(obj);
        }
      } else {
        obj.book = x.book_name;
        if (x.return_status) {
          obj.number = 1;
        } else {
          obj.number = -1;
        }
        obj_arr.push(obj);
      }
    }
    await getDocs(collection(db, "book_list")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      let books = [];
      for (let x of newData) {
        let obj = {};
        obj = x["book"];
        obj["book_id"] = x.id;
        books.push(obj);
      }
     try {
      if (obj_arr.length > 0) {
        for (let x of obj_arr) {
          let bookIndex = books.findIndex((o) => o.book_name == x.book);
          if (bookIndex > -1) {
            books[bookIndex]["available"] =
              Number(books[bookIndex].book_quantity) + Number(x.number);
            if (
              books[bookIndex]["available"] >=
              Number(books[bookIndex].book_quantity)
            ) {
              books[bookIndex]["available"] = Number(
                books[bookIndex].book_quantity
              );
            }
          } else {
            bookIndex &&(  books[bookIndex]["available"] = books[bookIndex]?.book_quantity);
          }
        }
        for (let book of books) {
          if (book["available"] == undefined) {
            book["available"] = book.book_quantity;
          }
        }
      }
     } catch (error) {
        console.log(error)
     }
      setBooks(books);
    });
  };
  const getHistory = async (queryDate = false) => {
    const collectionRef = collection(db, "allot_list");
    let start = null;
    let end = null;
    if (queryDate) {
      if (startDate) {
        start = new Date(startDate).getTime();
      } else {
        start = new Date(0).getTime();
      }
      if (endDate) {
        end = new Date(endDate).getTime();
      } else {
        end = Date.now() + 31536000000;
      }
    } else {
      start = new Date(0).getTime();
      end = Date.now() + 31536000000;
    }
    const q = query(
      collectionRef,
      and(
        where("allot.expected_return_date", ">=", start),
        where("allot.expected_return_date", "<=", end)
      )
    );
    await getDocs(q).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      let allot = [];
      for (let x of newData) {
        if ("allot" in x) {
          let date1 = new Date(x["allot"]["borrowed_date"]);
          x["allot"]["borrowed_date"] = date1.toLocaleDateString();
          let date2 = new Date(x["allot"]["expected_return_date"]);
          x["allot"]["expected_return_date"] = date2.toLocaleDateString();
          let obj = x["allot"];
          obj["id"] = x.id;
          allot.push(obj);
        }
      }
      setHistory(allot);
      if (queryDate) {
        setOpenFilter(false);
      }
    });
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

  

  const studentColumns = useMemo(
    () => [
      {
        accessorKey: "student_id", //simple recommended way to define a column
        header: "Student ID",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "student_name", //simple recommended way to define a column
        header: "Name",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "student_phone", //simple recommended way to define a column
        header: "Phone",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "student_batch", //simple recommended way to define a column
        header: "Batch",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
    ],
    []
  );

  const bookColumns = useMemo(
    () => [
      {
        accessorKey: 'book_reg', //simple recommended way to define a column
        header: 'Reg No',
        muiTableHeadCellProps: { sx: { color: 'green' } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "book_name", //simple recommended way to define a column
        header: "Name",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "book_price", //simple recommended way to define a column
        header: "Price",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "book_quantity", //simple recommended way to define a column
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

  const historyColumns = useMemo(
    () => [
      {
        accessorKey: "student_id", //simple recommended way to define a column
        header: "ID",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "book_reg", //simple recommended way to define a column
        header: "Reg No",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "student_name", //simple recommended way to define a column
        header: "Student Name",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "book_name", //simple recommended way to define a column
        header: "Book Name",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "borrowed_date", //simple recommended way to define a column
        header: "Borrowed Date",
        muiTableHeadCellProps: { sx: { color: "green" } }, //optional custom props
        Cell: ({ cell }) => <span>{cell.getValue()}</span>, //optional custom cell render
      },
      {
        accessorKey: "expected_return_date", //simple recommended way to define a column
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
              
              onChange={(e)=> {log(e)  }}
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

  const handleEditBook = (e) => {
    setEditBookDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditStudent = (e) => {
    const student = students.find(
      (student) => student.student_id === e.target.value
    );

    if (!student) {
      setEditStudentDetails((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };
  const handleEditBookSubmit = async (e) => {
    const docRef = doc(db, "book_list", editBookDetails.book_id);
    const editDoc = await updateDoc(docRef, {
      book: editBookDetails,
    });
    setOpen(false);
  };
  const handleDeleteBook = async (e) => {
    await deleteDoc(doc(db, "book_list", editBookDetails.book_id));
    getBooks();
    setTab("books");
  };

  const handleEditStudentSubmit = async (e) => {
    const docRef = doc(db, "student_list", editStudentDetails.student_id_db);
    const editDoc = await updateDoc(docRef, {
      student: editStudentDetails,
    });
    getStudents();
    setTab("students");
    setOpenStudent(false);
  };

  const handleDeleteStudent = async (e) => {
    const studentId = editStudentDetails?.student_id_db;

    try {
      console.log("student id --->", studentId);
      if (studentId !== "") {
        const studentRef = await doc(db, "student_list", studentId);
        console.log(studentId);
        await deleteDoc(studentRef);
      }
    } catch (error) {
      console.log(error);
    }

    getStudents();
    setTab("students");
  };

  function editBook(data, isDelete = false, isBook = false) {
    if (isDelete) {
      if (isBook) {
        console.log(editBookDetails);
        handleDeleteBook();
      } else {
        setEditStudentDetails(data.original);
        handleDeleteStudent();
      }
    } else {
      if (isBook) {
        setEditBookDetails(data.original);
        setOpen(true);
      } else {
        console.log(data.original);
        setEditStudentDetails(data.original);
        console.log(editStudentDetails);
        setOpenStudent(true);
      }
    }
  }

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
    
    // const collectionRef = collection(db, "allot_list");
    // console.log("dataabase test");
    // let start = null;
    // let end = null;
    // if (startDate || endDate) {
    //   if (startDate) {
    //     start = new Date(startDate).getTime();
    //   } else {
    //     start = new Date(0).getTime();
    //   }
    //   if (endDate) {
    //     end = new Date(endDate).getTime();
    //   } else {
    //     end = new Date().getTime() + 31536000000;
    //   }
    // } else {
    //   start = new Date().getTime();
    //   end = new Date().getTime();
    // }
    // const q = query(
    //   collectionRef,
    //   and(
    //     where("allot.expected_return_date", ">=", start),
    //     where("allot.expected_return_date", "<=", end)
    //   )
    // );
    // await getDocs(q).then((querySnapshot) => {

    //   const newData = querySnapshot.docs.map((doc) => ({
    //     ...doc.data(),
    //     id: doc.id,
    //   }));
    //   console.log(newData,"hehehehehehe");
    //   let student = [];
    //   student.push([
    //     "Student ID",
    //     "Student Name",
    //     "Book Name",
    //     "Borrowed Date",
    //     "Expected Return Date",
    //     "Return Status",
    //   ]);
    //   console.log(student,"student dtaa");
    //   let student_header = student[0].join(",");
    //   let value_string = "";
    //   for (let x of newData) {
        
    //     let date1 = new Date(x["allot"]["borrowed_date"]);
    //     x["allot"]["borrowed_date"] = date1.toLocaleDateString();
    //     let date2 = new Date(x["allot"]["expected_return_date"]);
    //     x["allot"]["expected_return_date"] = date2.toLocaleDateString();
    //     let obj = x["allot"];
    //     let arry = [
    //       obj.student_id,
    //       obj.student_name,
    //       obj.book_name,
    //       obj.borrowed_date,
    //       obj.expected_return_date,
    //       obj.return_status,
    //     ];
    //     console.log(arry,"db array");
    //     let string = arry.join(",");
    //     value_string = value_string + string + "\n";
    //   }
    //   console.log(newData,"newdata");
    //   let final_string = student_header + "\n" + value_string;
    //   const blob = new Blob([final_string], { type: "text/csv" });
    //   const url = window.URL.createObjectURL(blob);
    //   const a = document.createElement("a");
    //   a.href = url;
    //   a.download = "data.csv";
    //   document.body.appendChild(a);
    //   a.click();
    //   document.body.removeChild(a);
    // });
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
    //   // <div className="flex justify-center items-center h-full ">
    //   <div className="flex justify-center align-center items-center h-full">
    //     <div className="flex flex-col items-center justify-between border shadow-2xl w-full max-w-md p-6 ">
    //       <div className="flex flex-row items-center mb-4">
    //         <img src={logo} className="p-2 h-16 sm:max-h-[300px]" alt="Logo 1" />
        
    //         <img src={logoLogin} className="p-2 h-14 max-h-[90px]" alt="Logo 2" />
    //       </div>
    //       <form onSubmit={login} className="login w-full ">
    //         <div className="input-field mb-4">
    //           <input
    //             type="text"
    //             name="username"
    //             id="username"
    //             placeholder="Enter your user name"
    //             className="w-full px-4 py-2 border rounded-md"
    //           />
    //         </div>
    //         <div className="input-field mb-4">
    //           <input
    //             type="password"
    //             name="password"
    //             id="password"
    //             placeholder="Enter your password"
    //             className="w-full px-4 py-2 border rounded-md"
    //           />
    //         </div>
    //         <div className="input-field">
    //           <button type="submit" className="w-full bg-blue-900 text-white px-4 py-2 rounded-md">
    //          <h1>Log in</h1>
    //           </button>
    //         </div>
    //         <p class="text-center text-base px-4 py-2">or</p>

    //         <div className="input-field mb-4">
    //           <button type="button" className="w-full bg-blue-900 text-white px-4 py-2 rounded-md">
    //             Enter to E-Library
    //           </button>
    //         </div>
    //       </form>
    //     </div>
    //   </div>
    // // </div>

   
    // <div className="flex justify-center items-center h-full">
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
  

//   <div className="flex justify-center items-center h-full">
//     <div className="flex flex-col items-center justify-between border shadow-2xl w-full max-w-md p-6 md:w-96">
//       <div className="flex flex-row items-center mb-4">
//         <img src={logo} className="p-2 h-12 sm:h-16 md:h-20" alt="Logo 1" />
//         <img src={logoLogin} className="p-2 h-10 sm:h-14 md:h-16" alt="Logo 2" />
//       </div>
//       <form onSubmit={login} className="login w-full">
//         <div className="input-field mb-4">
//           <input
//             type="text"
//             name="username"
//             id="username"
//             placeholder="Enter your user name"
//             className="w-full px-4 py-2 border rounded-md"
//           />
//         </div>
//         <div className="input-field mb-4">
//           <input
//             type="password"
//             name="password"
//             id="password"
//             placeholder="Enter your password"
//             className="w-full px-4 py-2 border rounded-md"
//           />
//         </div>
//         <div className="input-field">
//           <button type="submit" className="w-full bg-blue-900 text-white px-4 py-2 rounded-md">
//             <h1>Log in</h1>
//           </button>
//         </div>
//         <p className="text-center text-base px-4 py-2">or</p>
//         <div className="input-field mb-4">
//           <button type="button" className="w-full bg-blue-900 text-white px-4 py-2 rounded-md">
//             Enter to E-Library
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>
// </div>


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
              onClick={() => [setTab("book_add_type"), addBook()]}
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
                enableRowActions
                renderRowActionMenuItems={({ row }) => [
                  <MenuItem
                    key="edit"
                    onClick={() => editBook(row, false, false)}
                  >
                    Edit
                  </MenuItem>,
                  <MenuItem
                    key="delete"
                    onClick={() => editBook(row, true, false)}
                  >
                    Delete
                  </MenuItem>,
                ]}
              />
            </div>
          </div>
          <div id={tab === "books" ? "display" : "no_display"}>
            <div id="students_table_container" style={{ marginTop: "4%" }}>
              <MaterialReactTable
                columns={bookColumns}
                data={bookObjects}
                enableColumnOrdering={true}
                enableRowSelection={true}
                enableSelectAll={true}
                enableMultiRowSelection={true}
                enablePagination={true}
                onRowSelectionChange={setRowSelection}
                state={{ rowSelection }}
                tableInstanceRef={bookTableInstanceRef}
                enableRowActions
                renderRowActionMenuItems={({ row }) => [
                  <MenuItem
                    key="edit"
                    onClick={() => editBook(row, false, true)}
                  >
                    Edit
                  </MenuItem>,
                  <MenuItem
                    key="delete"
                    onClick={() => editBook(row, true, true)}
                  >
                    Delete
                  </MenuItem>,
                ]}
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
                  onChange={handleEditBook}
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
                  onChange={handleEditBook}
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
                  onChange={handleEditBook}
                ></TextField>
              </div>
              <br></br>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleEditBookSubmit}>Edit</Button>
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
                  type="text"
                  id="outlined_basic"
                  label="Student ID"
                  name="student_id"
                  value={editStudentDetails.student_id}
                  onChange={handleEditStudent}
                  readOnly
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
                  onChange={handleEditStudent}
                ></TextField>
              </div>
              <br></br>
              <div>
                <TextField
                  fullWidth
                  type="number"
                  name="student_phone"
                  id="outlined_basic"
                  label="Student Phone"
                  value={editStudentDetails.student_phone}
                  onChange={handleEditStudent}
                ></TextField>
              </div>
              <br></br>
              <div>
                <TextField
                  fullWidth
                  type="number"
                  name="student_batch"
                  id="outlined_basic"
                  label="Student Batch"
                  value={editStudentDetails.student_batch}
                  onChange={handleEditStudent}
                ></TextField>
              </div>
              <br></br>
              <DialogActions>
                <Button onClick={handleCloseStudent}>Cancel</Button>
                <Button onClick={handleEditStudentSubmit}>Edit</Button>
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
                  type="text"
                  name="student_id"
                  placeholder="Student ID"
                  value={studentDetails.student_id}
                  onChange={handleStudentChange}
                />
                <p
                  style={{
                    marginLeft: "5%",
                    marginBottom: "0",
                    marginTop: "0",
                  }}
                  id="student_error"
                >
                  {addStudentError}
                </p>
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
                  type="text"
                  name="student_id"
                  placeholder="Student ID"
                  value={allotDetails.student_id}
                  onChange={handleAllotChange}
                />
              </div>
              <div style={{ marginTop: "5%" }}>
                <label for="name">Student Name</label>
                <input
                  type="text"
                  name="student_name"
                  placeholder="Student Name"
                  value={allotStudentName}
                  onChange={handleAllotChange}
                  readOnly
                />
              </div>
              <div style={{ marginTop: "5%" }}>
                <label for="name">Book Name</label>
                <CategorySearch allotBooksList={allotBooksList} handleAllotChange={handleAllotChange}  />

                {/* <select
                  required
                  name="book_id"
                  value={allotDetails.book_id}
                  onChange={handleAllotChange}
                >
                  <option value="" disabled selected>
                    Select a book
                  </option>
                  {allotBooksList.map((book) => {
                    return (
                      <option value={book.book_id}>{book.book_name}</option>
                    );
                  })}
                </select> */}
              </div>

              <div style={{ marginTop: "5%" }}>
                <label for="name">Book id</label>
                <input
                  type="text"
                  name="student_name"
                  placeholder="Book register id"
                  value={allotDetails?.book_reg}
                  onChange={handleAllotChange}
                  readOnly
                />
              </div>
              <div style={{ marginTop: "5%" }}>
                <label for="name">Borrowed Date</label>
                <input
                  type="date"
                  name="borrowed_date"
                  placeholder="Borrowed Date"
                  value={allotDetails.borrowed_date}
                  onChange={handleAllotChange}
                />
              </div>
              <div style={{ marginTop: "5%" }}>
                <label for="name">Expected Return Date</label>
                <input
                  type="date"
                  name="expected_return_date"
                  placeholder="Return Date"
                  value={allotDetails.expected_return_date}
                  onChange={handleAllotChange}
                />
              </div>
              <button
                id="submit"
                disabled={allotDetails.student_name == ""}
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
