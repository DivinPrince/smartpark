import { Router } from "express";
import { ReportsController } from "./reports.controller.js";

const router = Router();
const reportsController = new ReportsController();

// Get department summary report
router.get("/department-summary", reportsController.getDepartmentSummary);

// Get salary distribution report
router.get("/salary-distribution", reportsController.getSalaryDistribution);

// Get gender distribution report
router.get("/gender-distribution", reportsController.getGenderDistribution);

// Get employee tenure report
router.get("/employee-tenure", reportsController.getEmployeeTenure);

export default router; 