import { ReportsService } from "./reports.service.js";

const reportsService = new ReportsService();

export class ReportsController {
  async getDepartmentSummary(req, res) {
    try {
      const report = await reportsService.getDepartmentSummary();
      res.status(200).json(report);
    } catch (error) {
      console.error("Error in department summary report controller:", error);
      res.status(500).json({ error: error.message || "Failed to generate department summary report" });
    }
  }
  
  async getSalaryDistribution(req, res) {
    try {
      const report = await reportsService.getSalaryDistribution();
      res.status(200).json(report);
    } catch (error) {
      console.error("Error in salary distribution report controller:", error);
      res.status(500).json({ error: error.message || "Failed to generate salary distribution report" });
    }
  }
  
  async getGenderDistribution(req, res) {
    try {
      const report = await reportsService.getGenderDistribution();
      res.status(200).json(report);
    } catch (error) {
      console.error("Error in gender distribution report controller:", error);
      res.status(500).json({ error: error.message || "Failed to generate gender distribution report" });
    }
  }
  
  async getEmployeeTenure(req, res) {
    try {
      const report = await reportsService.getEmployeeTenure();
      res.status(200).json(report);
    } catch (error) {
      console.error("Error in employee tenure report controller:", error);
      res.status(500).json({ error: error.message || "Failed to generate employee tenure report" });
    }
  }
} 