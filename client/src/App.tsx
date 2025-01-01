import React from "react";
import { useState, useEffect } from "react";
import styles from "./App.module.css";
import Navbar from "./components/Navbar/Navbar";
import { submitObj } from "./components/Navbar/Navbar";
import Main from "./components/Main/Main";
import { swalNormalAlert } from "./utils";
import { fetchDeptList, fetchYearList, fetchAvgGrades, AvgObj } from "./api";

const App: React.FC = () => {
  const [deptList, setDeptList] = useState<string[]>([]);
  const [yearList, setYearList] = useState<string[]>([]);
  const [fetchedAvgGrades, setFetchedAvgGrades] = useState<AvgObj[]>([]);
  const [avgListGroup, setAvgListGroup] = useState<AvgObj[][]>([]);

  // useEffect to check if server is connected and retrive the year range and dept lists first
  useEffect(() => {
    const setUp = async () => {
      try {
        const fetchedDeptList = await fetchDeptList();
        // console.log(fetchedDeptList);
        setDeptList(fetchedDeptList.map((dept) => dept.toUpperCase()));

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

  useEffect(() => {
    groupAvgLists();
  }, [fetchedAvgGrades]);

  const groupAvgLists = () => {
    const newListGroup: AvgObj[][] = [];
    const listForProcess = [...fetchedAvgGrades];
    while (listForProcess.length !== 0) {
      const newList: AvgObj[] = [];
      for (let i = 0; i < 7; i++) {
        const popped: AvgObj | undefined = listForProcess.shift();
        if (popped !== undefined) {
          newList.push(popped);
        } else {
          break;
        }
      }
      newListGroup.push(newList);
    }
    console.log("newListGroup");
    console.log(newListGroup);
    setAvgListGroup(newListGroup);
  };

  const handleSubmitFromNavbar = async (objForSubmit: submitObj) => {
    // console.log(`objForSubmit`);
    // console.log(objForSubmit);

    try {
      const fetchedAvgs = await fetchAvgGrades(objForSubmit);
      // console.log(fetchedAvgGrades);
      setFetchedAvgGrades(fetchedAvgs);
    } catch (err) {
      const errStr = err as string;
      console.log(`errStr: ${errStr}`);
      swalNormalAlert(errStr);
    }
  };

  return (
    <div className={styles.appContainer}>
      <Navbar
        deptList={deptList}
        yearList={yearList}
        handleSubmitFromNavbar={handleSubmitFromNavbar}
      />
      <Main avgListGroup={avgListGroup}/>
    </div>
  );
};

export default App;
