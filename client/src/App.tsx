import styles from "./App.module.css";
import Navbar from "./components/Navbar/Navbar";
import Main from "./components/Main/Main";

function App() {
  // useEffect to check if server is connected and retrive the year range and dept lists first

  return (
    <div className={styles.appContainer}>
      <Navbar />
      <Main />
    </div>
  );
}

export default App;
