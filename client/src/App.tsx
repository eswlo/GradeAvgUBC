import React from "react";
import { useState, useEffect } from "react";
import styles from "./App.module.css";
import Navbar from "./components/Navbar/Navbar";
import Main from "./components/Main/Main";
import { swalNormalAlert } from "./utils";
import { fetchDeptList, fetchYearList } from "./api";

const App: React.FC = () => {
  const [deptList, setDeptList] = useState<string[]>([]);
  const [yearList, setYearList] = useState<string[]>([]);

  // useEffect to check if server is connected and retrive the year range and dept lists first
  useEffect(() => {
    const setUp = async () => {
      try {
        const fetchedDeptList = await fetchDeptList();
        console.log(fetchedDeptList);
        setDeptList(fetchedDeptList);

        const fetchedYearList = await fetchYearList();
        console.log(fetchedYearList);
        setYearList(fetchedYearList);
      } catch (err) {
        console.log(err);
        swalNormalAlert("Failed to retrieve data; server may be down.");
      }
    };

    setUp();
  }, []);

  return (
    <div className={styles.appContainer}>
      <Navbar deptList={deptList} yearList={yearList} />
      <Main />
    </div>
  );
};

export default App;
