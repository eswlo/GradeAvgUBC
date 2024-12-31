import React from "react";
import { useState, useEffect } from "react";
import styles from "./App.module.css";
import Navbar from "./components/Navbar/Navbar";
import { submitObj } from "./components/Navbar/Navbar";
import Main from "./components/Main/Main";
import { swalNormalAlert } from "./utils";
import { fetchDeptList, fetchYearList, fetchAvgGrades } from "./api";

const App: React.FC = () => {
  const [deptList, setDeptList] = useState<string[]>([]);
  const [yearList, setYearList] = useState<string[]>([]);

  // useEffect to check if server is connected and retrive the year range and dept lists first
  useEffect(() => {
    const setUp = async () => {
      try {
        const fetchedDeptList = await fetchDeptList();
        // console.log(fetchedDeptList);
        setDeptList(fetchedDeptList);

        const fetchedYearList = await fetchYearList();
        // console.log(fetchedYearList);
        setYearList(fetchedYearList);
      } catch (err) {
        console.log(err);
        swalNormalAlert("Failed to retrieve data. Server may be down.");
      }
    };

    setUp();
  }, []);

  const handleSubmitFromNavbar = async (objForSubmit: submitObj) => {
    console.log(`objForSubmit`);
    console.log(objForSubmit);

    try {
      const fetchedAvgGrades = await fetchAvgGrades(objForSubmit);
      console.log(fetchedAvgGrades);
    } catch(err) {
      const errStr = err as string; 
      console.log(`errStr: ${errStr}`);
      swalNormalAlert(errStr);
    }
  };

  return (
    <div className={styles.appContainer}>
      <Navbar deptList={deptList} yearList={yearList} handleSubmitFromNavbar={handleSubmitFromNavbar}/>
      <Main />
    </div>
  );
};

export default App;
