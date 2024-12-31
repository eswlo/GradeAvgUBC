import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useState, useEffect } from "react";
import { AvgObj } from "../../api";
import styles from "./Card.module.css";

const BACKGROUND_COLORS = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(255, 159, 64, 0.2)",
  "rgba(255, 205, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(153, 102, 255, 0.2)",
  "rgba(201, 203, 207, 0.2)",
];

const BORDER_COLORS = [
  "rgb(255, 99, 132)",
  "rgb(255, 159, 64)",
  "rgb(255, 205, 86)",
  "rgb(75, 192, 192)",
  "rgb(54, 162, 235)",
  "rgb(153, 102, 255)",
  "rgb(201, 203, 207)",
];

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface CardProps {
  fetchedAvgGrades: AvgObj[];
}

interface DeptCount {
  [key: string]: number;
}

const Card: React.FC<CardProps> = (props) => {
  const [labelListForAvgs, setLabelListForAvgs] = useState<string[]>([]);
  // const [titleList, setTitleList] = useState<string[]>([]);
  const [dataListForAvgs, setDataListForAvgs] = useState<number[]>([]);
  const [labelListForDeptCount, setLabelListForDeptCount] = useState<string[]>([]);
  const [dataListForDeptCount, setDataListForDeptCount] = useState<number[]>([]);

  const backgroundColors: string[] = [];
  const borderColors: string[] = [];

  useEffect(() => {
    // const newLabelList: string[] = props.fetchedAvgGrades.map((entry) => {
    //     return (entry.dept + String(entry.id));
    // });
    // // console.log(newLabelList);
    // const newTitleList: string[] = props.fetchedAvgGrades.map(entry => entry.title);
    // const newDataList: number[] = props.fetchedAvgGrades.map((entry) => Number(entry.average));

    const newLabelListforAvgs: string[] = [];
    // const newTitleList: string[] = [];
    const newDataListforAvgs: number[] = [];
    const newDeptCount: DeptCount = {};
    const newLabelListforDeptCount: string[] = [];
    const newDataListforDeptCount: number[] = [];

    props.fetchedAvgGrades.forEach((entry) => {
      newLabelListforAvgs.push(entry.dept + String(entry.id));
      // newTitleList.push(entry.title);
      newDataListforAvgs.push(Number(entry.average));
      
      if (Object.prototype.hasOwnProperty.call(newDeptCount, entry.dept)) {
        newDeptCount[entry.dept] +=1;
      } else {
        newDeptCount[entry.dept] = 1;
      }
    });

    const reorderedNewDeptCount = Object.fromEntries(
      Object.entries(newDeptCount).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    );

    for (const key in reorderedNewDeptCount) {
      newLabelListforDeptCount.push(key.toUpperCase());
      newDataListforDeptCount.push(reorderedNewDeptCount[key]);
    }

    setLabelListForAvgs(newLabelListforAvgs);
    // setTitleList(newTitleList);
    setDataListForAvgs(newDataListforAvgs);
    setLabelListForDeptCount(newLabelListforDeptCount);
    setDataListForDeptCount(newDataListforDeptCount);
  }, [props.fetchedAvgGrades]);

  //   console.log(props.fetchedAvgGrades);

  for (let i = 0; i < props.fetchedAvgGrades.length; i++) {
    backgroundColors.push(BACKGROUND_COLORS[i % BACKGROUND_COLORS.length]);
    borderColors.push(BORDER_COLORS[i % BORDER_COLORS.length]);
  }

  const dataForAvgs = {
    labels: labelListForAvgs,
    datasets: [
      {
        label: "Grade Average",
        data: dataListForAvgs,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const optionsForAvgs  = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        min: 0.0,
        max: 100.0,
      },
    },
  };



  const dataForDeptCount = {
    labels: labelListForDeptCount,
    datasets: [
      {
        label: "Number of Courses Offered",
        data: dataListForDeptCount,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const optionsForDeptCount  = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // Set the step size for the y-axis to ensure integer values
          stepSize: 1,   // Adjust this value as necessary to control the spacing
          precision: 0,  // Ensures the displayed value is rounded to an integer (no decimals)
        },
      },
    },
  };

  const makeChartOfDeptCount = () => {
    return (
      <div className={styles.chartContainer}>
        <Bar data={dataForDeptCount} options={optionsForDeptCount} />
      </div>
    );
  };

  const makeChartOfAvgs = () => {
    return (
      <div className={styles.chartContainer}>
        <Bar data={dataForAvgs } options={optionsForAvgs} />
      </div>
    );
  };

  const getTableBody = () => {
    if (props.fetchedAvgGrades.length !== 0) {
      return (
        <tbody>
          {props.fetchedAvgGrades.map((entry) => (
            <tr key={entry.dept + String(entry.id)}>
              <td>{entry.dept.toUpperCase() + " " + String(entry.id)}</td>
              <td>{entry.title}</td>
              <td>{entry.average}</td>
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
      </div>
    );
  };

  return (
    <div className={styles.card}>
      {/* <div>{makeChartOfAvgs()}</div> */}
      <div>{makeChartOfDeptCount()}</div>
      <div className={styles.tableContainer}>{makeTable()}</div>
    </div>
  );
};

export default Card;
