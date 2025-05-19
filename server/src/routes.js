import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import departmentRoutes from "./modules/department/department.routes.js";
import employeeRoutes from "./modules/employee/empolyee.routes.js";
import salaryRoutes from "./modules/salary/salary.routes.js";
import reportsRoutes from "./modules/reports/reports.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/departments", departmentRoutes);
router.use("/employees", employeeRoutes);
router.use("/salaries", salaryRoutes);
router.use("/reports", reportsRoutes);

export default router;
