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

const Card: React.FC<CardProps> = (props) => {
	const [labelList, setLabelList] = useState<string[]>([]);
	const [dataList, setDataList] = useState<number[]>([]);
	const backgroundColors: string[] = [];
	const borderColors: string[] = [];

    useEffect(() => {
        const newLabelList: string[] = props.fetchedAvgGrades.map((entry) => {
            return (entry.dept + String(entry.id));
        });
        // console.log(newLabelList);
        const newDataList: number[] = props.fetchedAvgGrades.map((entry) => Number(entry.average));
        setLabelList(newLabelList);
        setDataList(newDataList);
    }, [props.fetchedAvgGrades]);

//   console.log(props.fetchedAvgGrades);

for (let i = 0; i < props.fetchedAvgGrades.length; i++) {
    backgroundColors.push(BACKGROUND_COLORS[i % BACKGROUND_COLORS.length]);
    borderColors.push(BORDER_COLORS[i % BORDER_COLORS.length]);
}

const data = {
    labels: labelList,
    datasets: [
        {
            label: "Grade Average",
            data: dataList,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
        },
    ],
};

const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
        y: {
            beginAtZero: true,
        },
    },
};

const makeChart = () => {
    if (props.fetchedAvgGrades.length === 0) {
        return <h2>No data to render insight at this moment</h2>;
    } else {
        return getBarChartNoDonut();
    }
};

const getBarChartNoDonut = () => {
    return (
        <div>
            <Bar data={data} options={options} />
        </div>
    );
};

  return (<div>{makeChart()}</div>);
};



export default Card;
