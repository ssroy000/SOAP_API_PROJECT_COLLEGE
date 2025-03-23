import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "db.json");

const readDB = () => {
  try {
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return { employees: [] };
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to database:", error);
  }
};

export const getEmployees = () => readDB().employees;

export const getEmployeeById = (id) => getEmployees().find(emp => emp.id === id);

export const addEmployee = (employee) => {
  const db = readDB();
  employee.id = db.employees.length ? db.employees[db.employees.length - 1].id + 1 : 1;
  db.employees.push(employee);
  writeDB(db);
  return employee;
};

export const updateEmployee = (id, updatedData) => {
  const db = readDB();
  const index = db.employees.findIndex(emp => emp.id === id);
  
  if (index === -1) return null;

  db.employees[index] = { ...db.employees[index], ...updatedData };
  writeDB(db);
  return db.employees[index];
};

export const deleteEmployee = (id) => {
  const db = readDB();
  const filteredEmployees = db.employees.filter(emp => emp.id !== id);
  
  if (filteredEmployees.length === db.employees.length) return false;

  db.employees = filteredEmployees;
  writeDB(db);
  return true;
};
