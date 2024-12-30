import React, { useState } from "react";
import styles from "./Navbar.module.css";

const Navbar: React.FC = () => {
    const [courseLevel, setCourseLevel] = useState<string>("");

	const handleSetCourseLevel = (event: React.ChangeEvent<HTMLSelectElement>) => {
		if (event.target) {
			setCourseLevel(event.target.value);
		}
	};

  const getLevelMenu = () => {
    return (
      <select
        className={styles.levelDropdownMenu}
        id="levelDropdownMenu"
        value={courseLevel}
        onChange={handleSetCourseLevel}
        name="levelDropdownMenu"
      >
        <option value="" disabled>
        Coure level
        </option>
        <option value="1">100 level</option>
        <option value="2">200 level</option>
        <option value="3">300 level</option>
        <option value="4">400 level</option>
        <option value="5">500 level</option>
        <option value="6">600 level</option>
      </select>
    );
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.textContainer}>
        <h1>GradeAvgUBC</h1>
      </div>
      <div className={styles.selectContainer}>
        <div className={styles.deptsMenuContainer}>deptsMenuContainer</div>
        <div className={styles.levelMenuContainer}>{getLevelMenu()}</div>
        <div className={styles.inputContainer}>
          <div className={styles.yearRangeContainer}>yearRangeContainer</div>
          <div className={styles.avgBoundContainer}>avgBoundContainer</div>
        </div>
        <div className={styles.queryContainer}>queryContainer</div>
      </div>
    </nav>
  );
};

export default Navbar;
