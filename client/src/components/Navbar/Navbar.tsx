import React from "react";
import styles from "./Navbar.module.css";

const Navbar: React.FC = () => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.textContainer}>
                <h1>
                    GradeAvgUBC
                </h1>
            </div>
            <div className={styles.selectContainer}>
                <div className={styles.deptsMenuContainer}>
                    deptsMenuContainer
                </div>
                <div className={styles.levelMenuContainer}>
                    levelMenuContainer
                </div>
                <div className={styles.inputContainer}>
                    <div className={styles.yearRangeContainer}>
                        yearRangeContainer
                    </div>
                    <div className={styles.avgBoundContainer}>
                        avgBoundContainer
                    </div>
                </div>
                <div className={styles.queryContainer}>
                    queryContainer
                </div>
               
            </div>
            
        </nav>
    )
} 

export default Navbar;
