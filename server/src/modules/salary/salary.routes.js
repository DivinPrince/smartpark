import { Router } from "express";
import { salaryController } from "./salary.module.js";

const router = Router();

// Salary routes
router.get("/", salaryController.getAllSalaries);
router.get("/:id", salaryController.getSalaryById);
router.get("/employee/:employeeNumber", salaryController.getSalaryByEmployeeNumber);
router.post("/", salaryController.createSalary);
router.put("/:id", salaryController.updateSalary);
router.delete("/:id", salaryController.deleteSalary);

export default router; 