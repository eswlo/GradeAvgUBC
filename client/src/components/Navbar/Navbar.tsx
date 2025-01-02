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
  collapseDeptMenu: number;
  handleSubmitFromNavbar: (arg: submitObj) => void;
}

interface CheckboxState {
  [key: string]: boolean;
}

interface LabelState {
  [key: string]: boolean;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const [checkedDeptList, setCheckedDeptList] = useState<string[]>([]);
  const [checkboxes, setCheckboxes] = useState<CheckboxState>({});
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  const [courseLevelList, setCourseLevelList] = useState<string[]>(["100"]);
  const [yearStart, setYearStart] = useState<string>("");
  const [yearEnd, setYearEnd] = useState<string>("");
  const [avgLowerBound, setAvgLowerBound] = useState<string>("");
  const [avgHigherBound, setAvgHigherBound] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [displayedLabels, setDisplayedLabels] = useState<LabelState>({});

  useEffect(() => {
    const unReducedCheckboxes: CheckboxState[] = [];
    props.deptList.forEach((dept) => {
      const checkboxState: CheckboxState = { [dept]: false };
      unReducedCheckboxes.push(checkboxState);
    });
    const reducedCheckboxes = unReducedCheckboxes.reduce(
      (acc, obj) => ({ ...acc, ...obj }),
      {},
    ); // Convert the array of objects to a single object
    setCheckboxes(reducedCheckboxes);
    // console.log(reduced);

    const unReducedDisplayedLabels: CheckboxState[] = [];
    props.deptList.forEach((dept) => {
      const labelState: LabelState = { [dept]: true };
      unReducedDisplayedLabels.push(labelState);
    });
    const reducedDisplayedLabels = unReducedDisplayedLabels.reduce(
      (acc, obj) => ({ ...acc, ...obj }),
      {},
    ); // Convert the array of objects to a single object
    setDisplayedLabels(reducedDisplayedLabels);
    console.log(reducedDisplayedLabels);

    const yearListLen = props.yearList.length;
    if (yearListLen !== 0) {
      setYearStart(props.yearList[0]);
      setYearEnd(props.yearList[yearListLen - 1]);
    }
  }, [props.deptList, props.yearList]);

  useEffect(() => {
    const newCheckedDeptList: string[] = [];
    for (const key in checkboxes) {
      if (checkboxes[key]) {
        newCheckedDeptList.push(key);
      }
    }
    console.log(newCheckedDeptList);
    setCheckedDeptList(newCheckedDeptList);
  }, [checkboxes]);

  useEffect(() => {
    if (isSelectAll) {
      setCheckboxes((prevState) => {
        const updatedCheckboxes = { ...prevState };
        for (const key in updatedCheckboxes) {
          updatedCheckboxes[key] = true;
        }
        return updatedCheckboxes;
      });
    } else {
      setCheckboxes((prevState) => {
        const updatedCheckboxes = { ...prevState };
        for (const key in updatedCheckboxes) {
          updatedCheckboxes[key] = false;
        }
        return updatedCheckboxes;
      });
    }
  }, [isSelectAll]);

  useEffect(() => {
    // Collapse the department dropdown menu when user clicks on other areas.
    setIsExpanded(false);
  }, [props.collapseDeptMenu]);

  const showCheckboxes = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.stopPropagation(); // prevent propogation back to App's div onClick handler that close this dropdown menu
    // console.log(isExpanded);
    setIsExpanded((prevState) => !prevState);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    event.stopPropagation(); // prevent propogation back to App's div onClick handler that close this dropdown menu
    setCheckboxes((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const createLabels = () => {
    return props.deptList.map((dept) => {
      return (
        displayedLabels[dept] && (
          <div key={dept}>
            <label htmlFor={dept}>
              <input
                type="checkbox"
                id={dept}
                name={dept}
                checked={checkboxes[dept]}
                onChange={handleCheckboxChange}
              />
              {dept}
            </label>
          </div>
        )
      );
    });
  };

  const handleSelectAllChange = () => {
    setIsSelectAll((prevState) => !prevState);
  };

  const stopPropogation = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    // prevent propogation back to App's div onClick handler that close this dropdown menu
    event.stopPropagation();
  };

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target) {
      const { value } = event.target; // Destructure value from event target
      // console.log(value);
      setSearchInput(value);
      const updatedDisplayedLabels: LabelState = { ...displayedLabels };
      if (value.length === 0) {
        for (const key in updatedDisplayedLabels) {
          if (
            Object.prototype.hasOwnProperty.call(updatedDisplayedLabels, key)
          ) {
            updatedDisplayedLabels[key] = true;
          }
        }
      } else {
        const userInput = value.toUpperCase();
        console.log(userInput);
        props.deptList.forEach((dept) => {
          if (dept.indexOf(userInput) > -1) {
            // found, set to Shown
            updatedDisplayedLabels[dept] = true;
          } else {
            // not found, set to unshown
            updatedDisplayedLabels[dept] = false;
          }
        });
      }
      console.log(updatedDisplayedLabels);
      setDisplayedLabels(updatedDisplayedLabels);
    }
  };

  const getDeptMenuDescription = () => {
    if (isSelectAll) {
      return `Selected (${checkedDeptList.length})`;
    } else if (checkedDeptList.length === 0) {
      return `Department(s)`;
    } else if (checkedDeptList.length <= 3) {
      let str = "";
      checkedDeptList.forEach((dept) => {
        if (str === "") {
          str += dept;
        } else {
          str = str + ", " + dept;
        }
      });
      return str;
    } else {
      return `Selected (${checkedDeptList.length})`;
    }
  };

  const createDeptMenu = () => {
    return (
      <div className={styles.multiselect} onClick={stopPropogation}>
        <div className={styles.selectBox} onClick={showCheckboxes}>
          <select className={styles.deptDropdownMenu}>
            <option>{getDeptMenuDescription()}</option>
          </select>
          <div className={styles.overSelect}></div>
        </div>
        {isExpanded && (
          <div className={styles.deptDropDownContainer}>
            <div className={styles.searchInputContainer}>
              <input
                type="text"
                id="searchInput"
                placeholder="Search.."
                className={styles.searchInputField}
                name="searchInput"
                value={searchInput}
                onChange={handleSearchInput}
              />
            </div>
            <div className={styles.checkboxes}>
              <label htmlFor="all">
                <input
                  type="checkbox"
                  id="all"
                  name="all"
                  checked={isSelectAll}
                  onChange={handleSelectAllChange}
                />
                Select all
              </label>
              {createLabels()}
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleSetCourseLevel = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (event.target) {
      const newList: string[] = [event.target.value];
      setCourseLevelList(newList);
    }
  };

  const createLevelMenu = () => {
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

  const createYearMenus = () => {
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
        checkedDeptsForSubmit: checkedDeptList.map((dept) =>
          dept.toLowerCase(),
        ),
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
        <div className={styles.deptsMenuContainer}>{createDeptMenu()}</div>
        <div className={styles.levelMenuContainer}>{createLevelMenu()}</div>
        <div className={styles.inputContainer}>
          <div className={styles.yearRangeContainer}>{createYearMenus()}</div>
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
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={props.deptList.length === 0 ? true : false}
          >
            Submit
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
