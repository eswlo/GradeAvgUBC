import React, { useState } from "react";
import styles from "./Navbar.module.css";
import { swalNormalAlert } from "../../utils";

interface NavbarProps {
  deptList: string[];
  yearList: string[];
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const [courseLevel, setCourseLevel] = useState<string>("");
  const [yearStart, setYearStart] = useState<string>("");
  const [yearEnd, setYearEnd] = useState<string>("");
  const [avgLowerBound, setAvgLowerBound] = useState<string>("");
  const [avgHigherBound, setAvgHigherBound] = useState<string>("");

  const handleSetCourseLevel = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
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

  const handleSetYearRange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target) {
      const { id, value } = event.target; // Destructure id and value from event target
      if (id === "yearStartDropdownMenu") {
        setYearStart(value);
      } else {
        setYearEnd(value);
      }
    }
  };

  const fillYearListIn = () => {
    return props.yearList.length === 0 ? (
      <option disabled></option>
    ) : (
      props.yearList.map((id, index) => (
        <option key={index} value={id}>
          {id}
        </option>
      ))
    );
  };

  const getYearMenus = () => {
    return (
      <div>
        <span>Year range from</span>
        <select
          className={styles.yearDropdownMenu}
          id="yearStartDropdownMenu"
          value={yearStart}
          onChange={handleSetYearRange}
          name="yearStartDropdownMenu"
        >
          {fillYearListIn()}
        </select>
        <span>to</span>
        <select
          className={styles.yearDropdownMenu}
          id="yearEndDropdownMenu"
          value={yearEnd}
          onChange={handleSetYearRange}
          name="yearEndDropdownMenu"
        >
          {fillYearListIn()}
        </select>
      </div>
    );
  };

  const handleSetAvgBound = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target) {
      const { id, value } = event.target; // Destructure id and value from event target
      const numericValue = Number(value); // Convert to number
      if (isNaN(numericValue)) {
        swalNormalAlert("Invalid input, please enter a valid number!");
      } else {
        if (numericValue < 0 || numericValue > 100) {
          swalNormalAlert("Input out of bound, please re-enter!");
        } else {
          if (id === "avgLowerBound") {
            setAvgLowerBound(value);
          } else {
            setAvgHigherBound(value);
          }
        }
      }
    }
  };

  const handleSubmit = () => {
    /*
when processing query before submitting, check:
depts and course level are selected and not empty;
avg: check if empty string; convert to number to check if lowerbound <= higher bound.
if not, give warning and reset avgLowerBound and higher bound
      if (checkBoundCond()) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Invalid input bound, please re-enter!",
        });

year: check if year start <= year end
*/
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
          <div className={styles.yearRangeContainer}>{getYearMenus()}</div>
          <div className={styles.avgBoundContainer}>
            <span>Average from</span>
            <input
              type="text"
              id="avgLowerBound"
              placeholder="0.00"
              className={styles.avgInputField}
              name="avgInputField"
              value={avgLowerBound}
              onChange={handleSetAvgBound}
            />
            <span>to</span>
            <input
              type="text"
              id="avgHigherBound"
              placeholder="100.00"
              className={styles.avgInputField}
              name="avgInputField"
              value={avgHigherBound}
              onChange={handleSetAvgBound}
            />
          </div>
        </div>
        <div className={styles.submitContainer}>
          <button className={styles.submitBtn} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
