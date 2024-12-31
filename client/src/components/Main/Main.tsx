import React from "react";
import styles from "./Main.module.css";
import Card from "../Card/Card";
import { AvgObj } from "../../api";

interface MainProps {
  fetchedAvgGrades: AvgObj[]
}

const Main: React.FC<MainProps> = (props) => {
  return (
    <main className={styles.main}>
      <div className={styles.cardContainer}>
      <Card 
      fetchedAvgGrades={props.fetchedAvgGrades}/>
      </div>
    </main>
  );
};

export default Main;
