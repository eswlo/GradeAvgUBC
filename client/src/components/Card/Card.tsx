// import { useState, useEffect } from "react";
import { AvgObj } from "../../api";
import styles from "./Card.module.css";

interface CardProps {
  fetchedAvgGrades: AvgObj[];
  handleTDClick: (arg: AvgObj) => void;
}


const Card: React.FC<CardProps> = (props) => {

  const getTableBody = () => {
    const entryArray: AvgObj[] = [...props.fetchedAvgGrades];
    if (entryArray.length !== 0) {
      // Keey the table entry count to be 7 so that card size remains, otherwise
      // there may be a gap between the card/slide and the dots/pageNumber
      let emptyCount = 7 - entryArray.length;
      while (emptyCount > 0) {
        entryArray.push({
          dept: "n/a",
          id: emptyCount,
          title: "n/a",
          average: "n/a",
        });
        emptyCount = emptyCount - 1;
      }
      return (
        <tbody>
          {entryArray.map((entry) => (
            <tr 
              key={entry.dept + String(entry.id) + entry.title}
              className={
                entry.dept !== "n/a"
                  ? styles.withPointerClick
                  : styles.noPointerClick
              }
              {...(entry.dept !== "n/a"
                ? { onClick: () => props.handleTDClick(entry)}
                : {})}>
              <td>
                {entry.dept !== "n/a"
                  ? entry.dept.toUpperCase() + " " + String(entry.id)
                  : "N/A"}
              </td>
              <td>{entry.dept !== "n/a" ? entry.title : ""}</td>
              <td>{entry.dept !== "n/a" ? entry.average : ""}</td>
            </tr>
          ))}
        </tbody>
      );
    } else {
      return (
        <tbody>
          <td>n/a</td>
          <td>n/a</td>
          <td>n/a</td>
        </tbody>
      );
    }
  };

  const makeTable = () => {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Subject Code</th>
              <th>Subject Title</th>
              <th>Grade Average</th>
            </tr>
          </thead>
          {getTableBody()}
        </table>
        <p className={styles.tableNote}>
          * Click on a course entry to view its grade averages for the past 10 years.
        </p>
      </div>
    );
  };

  return (
    <div className={styles.card}>
      <div className={styles.tableContainer}>{makeTable()}</div>
    </div>
  );
};

export default Card;