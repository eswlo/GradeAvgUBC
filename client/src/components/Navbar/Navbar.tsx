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
                <h1>
                    Selects
                </h1>
            </div>
            
        </nav>
    )
} 

export default Navbar;
