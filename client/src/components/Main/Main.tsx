import styles from "./Main.module.css";
import Carousel from "../Carousel/Carousel";
// import Card from "../Card/Card";
import { AvgObj } from "../../api";
import "bootstrap/dist/css/bootstrap.min.css";
import Spinner from "react-bootstrap/Spinner";

interface MainProps {
  avgListGroup: AvgObj[][];
  dataLoaded: boolean;
}

const Main: React.FC<MainProps> = (props) => {
  // console.log(`props.dataLoaded: ${props.dataLoaded}`);
  return (
    <div className={styles.wrapper}>
    <main className={styles.main}>
      {props.dataLoaded ? (
        <Carousel avgListGroup={props.avgListGroup} />
      ) : (
        <div className={styles.spinnerContainer}>
          {
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          }
          <span className={styles.spannerMsg}>
            Loading Data...Please wait...
          </span>
        </div>
      )}
    </main>
    </div>
  );
};

export default Main;
