import { useContext } from "react";
import { DepartmentContext } from "./DepartmentContext";

export const useDepartment = () => {
  return useContext(DepartmentContext);
};