import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import departmentRoutes from "./modules/department/department.routes.js";
import employeeRoutes from "./modules/employee/empolyee.routes.js";
import salaryRoutes from "./modules/salary/salary.routes.js";
import reportsRoutes from "./modules/reports/reports.routes.js";
import { requireAdmin } from "./middleware/auth.middleware.js";

const router = Router();

// Public routes
router.use("/auth", authRoutes);

// Protected routes that require admin privileges
router.use("/departments", requireAdmin, departmentRoutes);
router.use("/employees", requireAdmin, employeeRoutes);
router.use("/salaries", requireAdmin, salaryRoutes);
router.use("/reports", requireAdmin, reportsRoutes);

export default router;
