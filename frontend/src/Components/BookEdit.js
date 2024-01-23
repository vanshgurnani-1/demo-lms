import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import "./BookEdit.css";
import axios from "axios";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { PieChart } from "@mui/x-charts/PieChart";

export default function Dashboard() {
  const [students, setStudents] = useState(0);
  const [books, setBooks] = useState(0);
  const [lending, setLending] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [graph, setGraph] = useState([]);

  useEffect(() => {
    getStudents();
    getBooks();
    getAllot();
    getRemain();
  }, []);

  const getStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/student/getStudent");
      const newData = response.data;
      setStudents(newData?.length);

      // Rest of your logic for data manipulation
    } catch (error) {
      console.log("get student api error ---> ", error);
    }
  };

  const getBooks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/book/getBook");
      const newData = response.data;
      setBooks(newData?.length);

      // Rest of your logic for data manipulation
    } catch (error) {
      console.log("get Books api error ---> ", error);
    }
  };

  const getAllot = async () => {
    try {
      const response = await axios.get("http://localhost:5000/allot/getAllot");
      const newData = response.data;
      setLending(newData?.length);

      // Rest of your logic for data manipulation
    } catch (error) {
      console.log("allot books api error ---> ", error);
    }
  };

  const getRemain = async () => {
    try {
      const response = await axios.get("http://localhost:5000/allot/getAllotNotReturned");
      const newData = response.data;
      setRemaining(newData?.length);

      // Rest of your logic for data manipulation
    } catch (error) {
      console.log("allot books api error ---> ", error);
    }
  };
  return (
    <div className="db">
      <div className="numbers">
        <div className="card">
          <div className="title">
            <p>Number of Students</p>
          </div>
          <div className="number">
            <CountUp end={students} duration={2}></CountUp>
          </div>
        </div>
        <div className="card">
          <div className="title">
            <p>Number of Books</p>
          </div>
          <div className="number">
            <CountUp end={books} duration={2}></CountUp>
          </div>
        </div>
        <div className="card">
          <div className="title">
            <p>Number of Books Lent</p>
          </div>
          <div className="number">
            <CountUp end={lending} duration={2}></CountUp>
          </div>
        </div>
        <div className="card">
          <div className="title">
            <p>Number of Books Pending</p>
          </div>
          <div className="number">
            <CountUp end={remaining} duration={2}></CountUp>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <div className="charts">
        <div className="flex flex-row gap-3 justify-around">
          <div className="chart">
          <PieChart
              series={[
                {
                  data: [
                    {
                      id: 0,
                      value: remaining,
                    
                      color: "#9656A1",
                    },
                    {
                      id: 1,
                      value: lending - remaining,
                     
                      color: "#efc2f9",
                    },


                    
                  ],
                
                },
              ]}
              width={400}
              height={400}
              slotProps={{ legend: { hidden: false } }}
              tooltip={{ hidden: true }}
              
            ></PieChart>
          </div>
          
        </div>
          <div className="label">
            <div className="flex">
              <div
                className="color"
                style={{ "background-color": "#9656A1" }}
              ></div>
              <p>Remaining Books - ({remaining})</p>
            </div>
            <div className="flex">
              <div
                className="color"
                style={{ "background-color": "#efc2f9" }}
              ></div>
              <p>Returned Books - ({lending - remaining})</p>
            </div>
          </div>
        </div>
        <div className="charts">
        <div className="flex flex-row gap-3 justify-around">
          <div className="chart">
          <PieChart
              series={[
                {
                  data: [
                    {
                      id: 0,
                      value: students,
                   
                      color: "#9656A1",
                    },
                    {
                      id: 1,
                      value: lending,
                    
                      color: "#efc2f9",
                    },


                    
                  ],
                
                },
              ]}
              width={400}
              height={400}
              slotProps={{ legend: { hidden: false } }}
              tooltip={{ hidden: true }}
              
            ></PieChart>
          </div>
          
        </div>
          <div className="label">
            <div className="flex">
              <div
                className="color"
                style={{ "background-color": "#9656A1" }}
              ></div>
              <p>Total Students - ({students})</p>
            </div>
            <div className="flex">
              <div
                className="color"
                style={{ "background-color": "#efc2f9" }}
              ></div>
              <p>Books Lend - ({lending})</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


