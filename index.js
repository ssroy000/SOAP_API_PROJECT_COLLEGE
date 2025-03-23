import express from "express";
import soap from "soap";
import { readFileSync } from "fs";
import { addEmployee, deleteEmployee, getEmployeeById, getEmployees, updateEmployee } from "./dbOperations.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

const soapEmployeeService = {
  EmployeeService: {
    EmployeePort: {
      getEmployee: ({ id }) => {
        const employee = getEmployeeById(parseInt(id));
        return employee ? employee : { message: "EMPLOYEE NOT FOUND" };
      },
      addEmployee: ({ name, email, position, salary }) => {
        if (!name || !email || !position || !salary) {
          return { message: "ALL FIELDS ARE REQUIRED" }
        }
        const employee = addEmployee({ name, email, position, salary });
        if (!employee) {
          return { message: "FAILED TO ADD EMPLOYEE" };
        }
        return { message: "NEW EMPLOYEE ADDED", id: employee.id };
      },
      updateEmployee: ({ id, name, email, position, salary }) => {
        if (!name && !email && !position && !salary) {
          return { message: "ATLEAST ONE FIELD IS REQUIRED" }
        }
        const updatedEmployee = updateEmployee(parseInt(id), {
          ...(name && { name }),
          ...(email && { email }),
          ...(position && { position }),
          ...(salary && { salary })
        });
        return updatedEmployee ? { message: "EMPLOYEE UPDATED" } : { message: "EMPLOYEE NOT FOUND" };
      },
      deleteEmployee: ({ id }) => {
        const result = deleteEmployee(parseInt(id));
        return result ? { message: "EMPLOYEE DELETED" } : { message: "EMPLOYEE NOT FOUND" };
      },
      getAllEmployees: () => {
        const employees = getEmployees();
        return employees;
      }
    }
  }
};


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const wsdlPath = path.join(__dirname, 'employeeService.wsdl')
const wsdlFile = readFileSync(wsdlPath,"utf-8");

const server = app.listen(PORT, () => console.log(`SOAP Service running on port ${PORT}`));
soap.listen(server, "/employeeservice", soapEmployeeService, wsdlFile);
