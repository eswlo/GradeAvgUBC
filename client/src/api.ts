import { StatusCodes } from "http-status-codes";
import { submitObj } from "./components/Navbar/Navbar";



let URL;

if (process.env.NODE_ENV === 'development') {
  URL = 'http://localhost:3000';
} else {
  URL = `https://gradeavgubcserver.onrender.com`;
}

// console.log(`URL: ${URL}`);

type DeptObj = {
  dept: string;
};

type YearObj = {
  year: number;
};

export type AvgObj = {
  dept: string;
  id: number;
  title: string;
  average: string;
};

export type AvgObj2 = {
  dept: string;
  id: number;
  year: number;
  title: string;
  average: string;
};

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

export const fetchAvgHistByCourse = async (
  dept: string,
  id: number,
  title: string,
): Promise<AvgObj2[]> => {
  try {
    const encodedTitle = encodeURIComponent(title);
    const response = await fetch(
      `${URL}/api/v1/grades/averages/${dept}/${id}/${encodedTitle}`,
    );
    if (response.status == StatusCodes.OK) {
      const dataResult: AvgObj2[] = (await response.json()).result;
      return dataResult;
    } else {
      const err = await response.json();
      console.log(err.error);
      return Promise.reject(
        `Failed to fetch ${dept} ${id} grade averages. ${err.error}`,
      );
    }
  } catch (err) {
    return Promise.reject(err); // Reject with the caught error
  }
};

export const fetchAvgGrades = async (
  objForSubmit: submitObj,
): Promise<AvgObj[]> => {
  try {
    const response = await fetch(`${URL}/api/v1/grades/averages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deptList: objForSubmit.checkedDeptsForSubmit,
        levelList: objForSubmit.checkedLevelsForSubmit,
        yearStart: objForSubmit.yearStartForSubmit,
        yearEnd: objForSubmit.yearEndForSubmit,
        avgLowerBound: objForSubmit.avgLowerBoundForSubmit,
        avgHigherBound: objForSubmit.avgHigherBoundForSubmit,
      }),
    });

    if (response.status === StatusCodes.OK) {
      const dataResult: AvgObj[] = (await response.json()).result;
      return dataResult;
    } else {
      const err = await response.json();
      console.log(err.error);
      return Promise.reject(`Failed to fetch grade averages. ${err.error}`);
    }
  } catch (err) {
    return Promise.reject(err); // Reject with the caught error
  }
};
