import styles from "./Main.module.css";
import Carousel from "../Carousel/Carousel";
// import Card from "../Card/Card";
import { AvgObj } from "../../api";
import "bootstrap/dist/css/bootstrap.min.css";
import Spinner from "react-bootstrap/Spinner";

interface MainProps {
  avgListGroup: AvgObj[][];
  dataLoaded: boolean;
  alterNavBarIndexZ: () => void;
}

const Main: React.FC<MainProps> = (props) => {
  // console.log(`props.dataLoaded: ${props.dataLoaded}`);
  return (
    <main className={styles.main}>
      <div className={styles.mainContainer}>
        {props.dataLoaded ? (
          <Carousel avgListGroup={props.avgListGroup} alterNavBarIndexZ={props.alterNavBarIndexZ}/>
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
      </div>
    </main>
  );
};

export default Main;
