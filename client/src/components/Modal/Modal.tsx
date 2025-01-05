import { useState, useEffect } from "react";
import { AvgObj, AvgObj2, fetchAvgHistByCourse } from "../../api";
import styles from "./Modal.module.css";
import { swalNormalAlert } from "../../utils";
import { Line } from "react-chartjs-2";
import { FaTimes } from 'react-icons/fa'; 

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

interface ModalProps {
clickedTDAvgObj: AvgObj | null;
  closeModal: () => void;
}


const Modal: React.FC<ModalProps> = (props) => {    
    const [clickedTDString, setClickedTDString] = useState<string>("");
      const [labelListForOneCourseAvgs, setLabelListForOneCourseAvgs] = useState<
        string[]
      >([]);
      const [dataListForOneCourseAvg, setDataListForOneCourseAvg] = useState<
        number[]
      >([]);


    const callFetchAvgHistByCourse = async () => {
        if (props.clickedTDAvgObj) {
        try {
            const fetchedAvgHistByCourse: AvgObj2[] = await fetchAvgHistByCourse(
              props.clickedTDAvgObj.dept,
              props.clickedTDAvgObj.id,
              props.clickedTDAvgObj.title,
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
            setClickedTDString(
                props.clickedTDAvgObj.dept.toUpperCase() + " " + String(props.clickedTDAvgObj.id) + " " + props.clickedTDAvgObj.title,
            );
            setLabelListForOneCourseAvgs(newLabelListForOneCourseAvgs);
            setDataListForOneCourseAvg(newDataListForOneCourseAvg);
          } catch (err) {
            const errStr = err as string;
            console.log(`errStr: ${errStr}`);
            swalNormalAlert(errStr);
          }
        }
    };


    useEffect(() => {
        callFetchAvgHistByCourse();
      }, [props.clickedTDAvgObj]);


      useEffect(() => {
        makeLineChartForOneCourseAvgs();
      }, [dataListForOneCourseAvg])


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

  const dataForOneCoureAvgs = {
    labels: labelListForOneCourseAvgs,
    datasets: [
      {
        label: `Average trend of ${clickedTDString.toUpperCase()}`,
        data: dataListForOneCourseAvg,
        fill: false,
        borderColor: "rgb(106, 90, 205, 0.5)",
        tension: 0,
        backgroundColor: "#002145",
      },
    ],
  };

  const makeLineChartForOneCourseAvgs = () => {
    console.log("in makeLineChartForOneCourseAvgs");
    // console.log(labelListForOneCourseAvgs);
    return (
      <div className={styles.chartContainer}>
        <Line data={dataForOneCoureAvgs} options={optionsForAvgs} />
      </div>
    );
  };

    return (
        <div className={styles.modalContainer}>
            <button
                className={styles.submitBtn}
                onClick={props.closeModal}>
            <FaTimes size={24} />
            </button>
            {makeLineChartForOneCourseAvgs()}
        </div> 
    )
}

export default Modal;