import { Router } from "express";
import { employeeController } from "./empolyee.module.js";

const router = Router();

// Employee routes
router.get("/", employeeController.getAllEmployees);
router.get("/:id", employeeController.getEmployeeById);
router.post("/", employeeController.createEmployee);
router.put("/:id", employeeController.updateEmployee);
router.delete("/:id", employeeController.deleteEmployee);
router.get("/department/:departmentId", employeeController.getEmployeesByDepartment);
router.get("/:id/salary", employeeController.getEmployeeSalary);

export default router;
