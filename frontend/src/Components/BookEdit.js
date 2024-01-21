import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import "./BookEdit.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { PieChart } from "@mui/x-charts/PieChart";

export default function Dashboard() {
  const [students, setStudents] = useState(0);
  const [books, setBooks] = useState(0);
  const [lending, setLending] = useState(0);
  const [remaining, setremaining] = useState(0);
  const [graph, setGraph] = useState([]);

  let remain = 0;

  useEffect(() => {
    getStudents();
    getBooks();
    getAllot();
  }, []);



  const getStudents = async (e) => {
    try {
      let newData
      await getDocs(collection(db, "student_list")).then((querySnapshot) => {
         newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setStudents(newData?.length);
         
      });
      console.log(newData)

      const groupedData = newData.reduce((result, item) => {
        
    
        if (!result[item?.student?.student_batch]) {
            result[item?.student?.student_batch] = []; // Initialize an array for the current ID
        }
        
        result[item?.student?.student_batch].push( item?.student ); // Push the data for the current ID
        return result;
      });
      console.log("group data " , groupedData)
    } catch (error) {
      console.log("get student api error ---> ", error);
    }
  };


  const getBooks = async (e) => {
    try {
      await getDocs(collection(db, "book_list")).then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setBooks(newData?.length);
      });
    } catch (error) {
      console.log("get Books api error ---> ", error);
    }
  };
  const getAllot = async (e) => {
    try {
      await getDocs(collection(db, "allot_list")).then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setLending(newData?.length);
        let pendingCount = 0;
        for (let x of newData) {
          if ("allot" in x) {
            if (!x["allot"]["return_status"]) {
              pendingCount++;
            }
          }
        }
        setremaining(pendingCount);
        remain = pendingCount;
        let data = [
          { id: 0, value: pendingCount, label: "Pending Books" },
          {
            id: 1,
            value: newData.length - pendingCount,
            label: "Returned Books",
          },
        ];
        setGraph(data);
      });
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


