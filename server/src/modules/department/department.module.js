import { DepartmentService } from "./department.service.js";
import { DepartmentController } from "./department.controller.js";

const departmentService = new DepartmentService();
const departmentController = new DepartmentController();

export { departmentService, departmentController };
