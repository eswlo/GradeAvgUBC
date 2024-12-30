import styles from "./App.module.css";
import Navbar from "./components/Navbar/Navbar";
import Main from "./components/Main/Main";

function App() {
  return (
    <div className={styles.appContainer}>
      <Navbar />
      <Main />
    </div>
  );
}

export default App;
