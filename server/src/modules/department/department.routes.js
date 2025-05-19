import { Router } from "express";
import { departmentController } from "./department.module.js";

const router = Router();

// Department routes
router.get("/", departmentController.getAllDepartments);
router.get("/:id", departmentController.getDepartmentById);
router.post("/", departmentController.createDepartment);
router.put("/:id", departmentController.updateDepartment);
router.delete("/:id", departmentController.deleteDepartment);
router.get("/:id/employees", departmentController.getDepartmentEmployees);

export default router;
