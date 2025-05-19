import { relations } from 'drizzle-orm';
import { int, mysqlTable, serial, text, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int().primaryKey().autoincrement(),
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text().notNull()
});

export const department = mysqlTable('department', {
  departmentCode: int().primaryKey().autoincrement(),
  departpentName: text().notNull(),
  grossSalary: text().notNull()
});

export const employee = mysqlTable('employee', {
  employeeNumber: int().primaryKey().autoincrement(),
  departmentCode: int().notNull().references(() => department.departmentCode),
  firstName: text().notNull(),
  lastName: text().notNull(),
  position: text().notNull(),
  address: text().notNull(),
  telephone: text().notNull(),
  gender: text().notNull(),
  hiredDate: timestamp().notNull()
});

export const salary = mysqlTable('salary', {
  id: int().primaryKey().autoincrement(),
  employeeNumber: int().notNull().references(() => employee.employeeNumber),
  totalDeduction: text().notNull(),
  grossSalary: int().notNull(),
  netSalary: int().notNull()
});

// Define relations
export const employeeRelations = relations(employee, ({ one }) => ({
  department: one(department, {
    fields: [employee.departmentCode],
    references: [department.departmentCode],
  }),
}));

export const departmentRelations = relations(department, ({ many }) => ({
  employees: many(employee),
}));

export const salaryRelations = relations(salary, ({ one }) => ({
  employee: one(employee, {
    fields: [salary.employeeNumber],
    references: [employee.employeeNumber],
  }),
}));