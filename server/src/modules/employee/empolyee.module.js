import { EmployeeService } from "./empolyee.service.js";
import { EmployeeController } from "./empolyee.controller.js";

const employeeService = new EmployeeService();
const employeeController = new EmployeeController();

export { employeeService, employeeController };
