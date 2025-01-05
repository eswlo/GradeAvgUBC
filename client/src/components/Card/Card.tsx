import { Line } from "react-chartjs-2";
// import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useState, useEffect } from "react";
import { AvgObj, AvgObj2, fetchAvgHistByCourse } from "../../api";
import styles from "./Card.module.css";
import { swalNormalAlert } from "../../utils";

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
  PointElement,
  LineElement,
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
  // const [titleList, setTitleList] = useState<string[]>([]);
  // const [labelListForAvgs, setLabelListForAvgs] = useState<string[]>([]);
  // const [dataListForAvgs, setDataListForAvgs] = useState<number[]>([]);
  // const [labelListForDeptCount, setLabelListForDeptCount] = useState<string[]>(
  //   [],
  // );
  // const [dataListForDeptCount, setDataListForDeptCount] = useState<number[]>(
  //   [],
  // );
  const [labelListForOneCourseAvgs, setlabelListForOneCourseAvgs] = useState<
    string[]
  >([]);
  const [dataListForOneCourseAvg, setDataListForOneCourseAvg] = useState<
    number[]
  >([]);
  const [clickedTD, setClickedTD] = useState<string>("");
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
        newDeptCount[entry.dept] += 1;
      } else {
        newDeptCount[entry.dept] = 1;
      }
    });

    const reorderedNewDeptCount = Object.fromEntries(
      Object.entries(newDeptCount).sort(([keyA], [keyB]) =>
        keyA.localeCompare(keyB),
      ),
    );

    for (const key in reorderedNewDeptCount) {
      newLabelListforDeptCount.push(key.toUpperCase());
      newDataListforDeptCount.push(reorderedNewDeptCount[key]);
    }

    // setLabelListForAvgs(newLabelListforAvgs);
    // setTitleList(newTitleList);
    // setDataListForAvgs(newDataListforAvgs);
    // setLabelListForDeptCount(newLabelListforDeptCount);
    // setDataListForDeptCount(newDataListforDeptCount);

    setClickedTD("");
    setlabelListForOneCourseAvgs([]);
    setDataListForOneCourseAvg([]);
  }, [props.fetchedAvgGrades]);

  useEffect(() => {
    console.log(clickedTD);
    makeLineChartForOneCourseAvgs();
  }, [clickedTD]);

  //   console.log(props.fetchedAvgGrades);

  for (let i = 0; i < props.fetchedAvgGrades.length; i++) {
    backgroundColors.push(BACKGROUND_COLORS[i % BACKGROUND_COLORS.length]);
    borderColors.push(BORDER_COLORS[i % BORDER_COLORS.length]);
  }

  // const dataForAvgs = {
  //   labels: labelListForAvgs,
  //   datasets: [
  //     {
  //       label: "Grade Average",
  //       data: dataListForAvgs,
  //       backgroundColor: backgroundColors,
  //       borderColor: borderColors,
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  const optionsForAvgs = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: "#002145" },
      },
      y: {
        beginAtZero: true,
        min: 0.0,
        max: 100.0,
        ticks: { color: "#002145" },
      },
    },
  };

  // const dataForDeptCount = {
  //   labels: labelListForDeptCount,
  //   datasets: [
  //     {
  //       label: "Number of Courses Offered",
  //       data: dataListForDeptCount,
  //       backgroundColor: backgroundColors,
  //       borderColor: borderColors,
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  // const optionsForDeptCount = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   scales: {
  //     y: {
  //       beginAtZero: true,
  //       ticks: {
  //         // Set the step size for the y-axis to ensure integer values
  //         stepSize: 1, // Adjust this value as necessary to control the spacing
  //         precision: 0, // Ensures the displayed value is rounded to an integer (no decimals)
  //       },
  //     },
  //   },
  // };

  const dataForOneCoureAvgs = {
    labels: labelListForOneCourseAvgs,
    datasets: [
      {
        label: `Average trend of ${clickedTD.toUpperCase()}`,
        data: dataListForOneCourseAvg,
        fill: false,
        borderColor: "rgb(106, 90, 205, 0.5)",
        tension: 0,
        backgroundColor: "#002145",
      },
    ],
  };

  const makeLineChartForOneCourseAvgs = () => {
    // console.log("in makeLineChartForOneCourseAvgs");
    // console.log(labelListForOneCourseAvgs);
    return (
      <div className={styles.chartContainer}>
        <Line data={dataForOneCoureAvgs} options={optionsForAvgs} />
      </div>
    );
  };

  // const makeBarChartOfDeptCount = () => {
  //   return (
  //     <div className={styles.chartContainer}>
  //       <Bar data={dataForDeptCount} options={optionsForDeptCount} />
  //     </div>
  //   );
  // };

  // const makeBarChartOfAvgs = () => {
  //   return (
  //     <div className={styles.chartContainer}>
  //       <Bar data={dataForAvgs} options={optionsForAvgs} />
  //     </div>
  //   );
  // };

  const handleTDClick = async (entry: AvgObj) => {
    try {
      const fetchedAvgHistByCourse: AvgObj2[] = await fetchAvgHistByCourse(
        entry.dept,
        entry.id,
        entry.title,
      );
      console.log(fetchedAvgHistByCourse);
      let i = fetchedAvgHistByCourse.length - 1;
      const newLabelListForOneCourseAvgs: string[] = [];
      const newDataListForOneCourseAvg: number[] = [];
      let count = 0;
      while (i > 0) {
        if (count === 10) {
          break;
        } else {
          if (fetchedAvgHistByCourse[i].year !== 1900) {
            newLabelListForOneCourseAvgs.unshift(
              String(fetchedAvgHistByCourse[i].year),
            );
            newDataListForOneCourseAvg.unshift(
              Number(fetchedAvgHistByCourse[i].average),
            );
          }
          i--;
          count++;
        }
      }
      console.log(newLabelListForOneCourseAvgs);
      console.log(newDataListForOneCourseAvg);
      setClickedTD(
        entry.dept.toUpperCase() + " " + String(entry.id) + " " + entry.title,
      );
      setlabelListForOneCourseAvgs(newLabelListForOneCourseAvgs);
      setDataListForOneCourseAvg(newDataListForOneCourseAvg);
    } catch (err) {
      const errStr = err as string;
      console.log(`errStr: ${errStr}`);
      swalNormalAlert(errStr);
    }
  };

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
            <tr key={entry.dept + String(entry.id) + entry.title}>
              <td
                className={
                  entry.dept !== "n/a"
                    ? styles.withPointerClick
                    : styles.noPointerClick
                }
                {...(entry.dept !== "n/a"
                  ? { onClick: () => handleTDClick(entry) }
                  : {})}
              >
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
          * Click on subject code to view grade averages for the past 10 years.
        </p>
      </div>
    );
  };

  return (
    <div className={styles.card}>
      <div className={styles.tableContainer}>{makeTable()}</div>
      {makeLineChartForOneCourseAvgs()}
    </div>
  );
};

export default Card;
