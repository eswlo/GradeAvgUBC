import { StatusCodes } from "http-status-codes";
import { submitObj } from "./components/Navbar/Navbar";

const URL = `http://localhost:3000`;

type DeptObj = {
  dept: string;
};

type YearObj = {
  year: number;
};

type AvgObj = {
  dept: string;
  id: number;
  average: string;
}

export const fetchDeptList = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${URL}/api/v1/grades/departments`);
    if (response.status == StatusCodes.OK) {
      const data = await response.json();
      const deptList = data.result.map((obj: DeptObj) => obj.dept);
      return deptList;
    } else {
      return Promise.reject("Failed to fetch departments.");
    }
  } catch (err) {
    return Promise.reject(err); // Reject with the caught error
  }
};

export const fetchYearList = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${URL}/api/v1/grades/years`);
    if (response.status == StatusCodes.OK) {
      const data = await response.json();
      const yearList = data.result.map((obj: YearObj) => String(obj.year));
      if (yearList.length !== 0 && yearList[0] === "1900") {
        yearList.shift();
      }
      return yearList;
    } else {
      return Promise.reject("Failed to fetch departments.");
    }
  } catch (err) {
    return Promise.reject(err); // Reject with the caught error
  }
};

export const fetchAvgGrades = async (objForSubmit: submitObj): Promise<AvgObj[]> => {
  try {
		const response = await fetch(`${URL}/api/v1/grades/averages`, {
			method: "POST",
			headers: {
        'Content-Type': 'application/json',
			},
			body: JSON.stringify({
        "deptList": objForSubmit.checkedDeptsForSubmit,
        "levelList": objForSubmit.checkedLevelsForSubmit,
      "yearStart": objForSubmit.yearStartForSubmit,
        "yearEnd": objForSubmit.yearEndForSubmit,
        "avgLowerBound": objForSubmit.avgLowerBoundForSubmit,
        "avgHigherBound": objForSubmit.avgHigherBoundForSubmit
      }),
		});

    if (response.status === StatusCodes.OK) {
      const data = await response.json();
      return data.result;
    } else {
      const err = await response.json();
      console.log(err.error);
      return Promise.reject(`Failed to fetch grade averages. ${err.error}`);
    }
  } catch (err) {
    return Promise.reject(err); // Reject with the caught error
  }
};