import { SalaryService } from "./salary.service.js";
import { SalaryController } from "./salary.controller.js";

const salaryService = new SalaryService();
const salaryController = new SalaryController();

export { salaryService, salaryController }; 