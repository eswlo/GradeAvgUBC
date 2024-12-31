import React, { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { swalNormalAlert } from "../../utils";

export interface submitObj {
  checkedDeptsForSubmit: string[];
  checkedLevelsForSubmit: number[];
  yearStartForSubmit: number;
  yearEndForSubmit: number;
  avgLowerBoundForSubmit: number;
  avgHigherBoundForSubmit: number;
}

interface NavbarProps {
  deptList: string[];
  yearList: string[];
  handleSubmitFromNavbar: (arg: submitObj) => void;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const [checkedDeptList, setCheckedDeptList] = useState<string[]>(["cpsc"]);
  const [courseLevelList, setCourseLevelList] = useState<string[]>(["100"]);
  const [yearStart, setYearStart] = useState<string>("");
  const [yearEnd, setYearEnd] = useState<string>("");
  const [avgLowerBound, setAvgLowerBound] = useState<string>("");
  const [avgHigherBound, setAvgHigherBound] = useState<string>("");

  useEffect(() => {
    const yearListLen = props.yearList.length;
    if (yearListLen !== 0) {
      setYearStart(props.yearList[0]);
      setYearEnd(props.yearList[yearListLen - 1]);
    }
  }, [props.yearList]);

  const handleSetCourseLevel = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (event.target) {
      const newList: string[] = [event.target.value];
      setCourseLevelList(newList);
    }
  };

  const getLevelMenu = () => {
    return (
      <select
        className={styles.levelDropdownMenu}
        id="levelDropdownMenu"
        value={courseLevelList[0]}
        onChange={handleSetCourseLevel}
        name="levelDropdownMenu"
      >
        <option value="" disabled>
          Course level
        </option>
        <option value="100">100 level</option>
        <option value="200">200 level</option>
        <option value="300">300 level</option>
        <option value="400">400 level</option>
        <option value="500">500 level</option>
        <option value="600">600 level</option>
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

  /*
when processing query before submitting, check:
depts and course levels are selected and not empty; convert courselevelList to number[]
avg: check if empty string; convert to number to check if lowerbound <= higher bound.
if not, give warning and reset avgLowerBound and higher bound
      if (checkBoundCond()) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Invalid input bound, please re-enter!",
        });

years: convert to number and check if year start <= year end
*/
  const isValidValuesForSubmit = () => {
    if (checkedDeptList.length === 0) {
      throw new Error("Must select at least one department/subject.");
    } else if (courseLevelList.length === 0) {
      throw new Error("Must select at least one course level.");
    } else if (Number(yearStart) > Number(yearEnd)) {
      throw new Error("Invalid year range.");
    } else if (avgLowerBound.length === 0 || avgHigherBound.length === 0) {
      throw new Error("Please enter search bound for grade average.");
    } else if (Number(avgLowerBound) > Number(avgHigherBound)) {
      throw new Error("Invalid average bound.");
    }
  };

  const handleSubmit = () => {
    // console.log(yearStart);
    // console.log(yearEnd);
    // console.log(courseLevelList);
    try {
      isValidValuesForSubmit();
      const objForSubmit: submitObj = {
        checkedDeptsForSubmit: checkedDeptList,
        checkedLevelsForSubmit: courseLevelList.map((courseLevelStr) =>
          Number(courseLevelStr),
        ),
        yearStartForSubmit: Number(yearStart),
        yearEndForSubmit: Number(yearEnd),
        avgLowerBoundForSubmit: Number(avgLowerBound),
        avgHigherBoundForSubmit: Number(avgHigherBound),
      };
      props.handleSubmitFromNavbar(objForSubmit);
    } catch (err) {
      if (err instanceof Error) {
        swalNormalAlert(err.message);
      } else {
        swalNormalAlert(`An unexpected error occurred`);
        console.log("An unexpected error occurred:", err);
      }
    }
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
