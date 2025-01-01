import styles from "./Main.module.css";
import Carousel from "../Carousel/Carousel";
// import Card from "../Card/Card";
import { AvgObj } from "../../api";

interface MainProps {
  avgListGroup: AvgObj[][];
}

const Main: React.FC<MainProps> = (props) => {
  return (
    <main className={styles.main}>
      {<Carousel avgListGroup={props.avgListGroup} />}
    </main>
  );
};

export default Main;
