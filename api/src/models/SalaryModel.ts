import * as mongoose from 'mongoose';

const { Schema } = mongoose;

// TODO add ID of different models later, for wages and what not

const SalarySchema = Schema({
  employeeId: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  employeeDocumentId: { type: String },
  wage: { type: Number },
  date: { type: Date, required: true },
  attendanceId: { type: String, required: true },
  totalWorkedDays: { type: Number, default: 30 },
  paidSalary: { type: Number, default: 0 },
  nightHoursHours: { type: Number, default: 0 },
  nightHoursAmount: { type: Number, default: 0 },
  dailyExtraHoursHours: { type: Number, default: 0 },
  dailyExtraHoursAmount: { type: Number, default: 0 },
  nightlyExtraHoursHours: { type: Number, default: 0 },
  nightlyExtraHoursAmount: { type: Number, default: 0 },
  weekendHoursHours: { type: Number, default: 0 },
  weekendHoursAmount: { type: Number, default: 0 },
  nightlyWeekendExtraHoursHours: { type: Number, default: 0 },
  nightlyWeekendExtraHoursAmount: { type: Number, default: 0 },
  holidayDays: { type: Number, default: 0 },
  holidaysAmount: { type: Number, default: 0 },
  otherIncomes: { type: Number, default: 0 },
  unjustifiedAbsenceDays: { type: Number, default: 0 },
  unjustifiedAbsenceAmount: { type: Number, default: 0 },
  subTotal: { type: Number, default: 0 },
  discountIps: { type: Number, default: 0 },
  discountAdvancePayment: { type: Number, default: 0 },
  discountLoans: { type: Number, default: 0 },
  discountJudicial: { type: Number, default: 0 },
  suspensionDays: { type: Number, default: 0 },
  suspensionAmount: { type: Number, default: 0 },
  lateArrivalHours: { type: Number, default: 0 },
  lateArrivalMinutes: { type: Number, default: 0 },
  lateArrivalAmount: { type: Number, default: 0 },
  otherDiscounts: { type: Number, default: 0 },
  familyBonus: { type: Number, default: 0 },
  netToDeposit: { type: Number, default: 0 },
  viaticum: { type: Number, default: 0 },
  parking: { type: Number, default: 0 },
  salaryBump: { type: Number, default: 0 },
  totalPayment: { type: Number, default: 0 },
  laborRegime: { type: String, default: 'monthly' },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

export default SalarySchema;

export interface SalaryInterface {
  employeeId: string;
  firstName: string;
  lastName: string;
  employeeDocumentId: string;
  wage: number;
  jobTitle: string;
  date: Date;
  attendanceId: string;
  totalWorkedDays: number;
  paidSalary: number;
  nightHoursHours: number;
  nightHoursAmount: number;
  dailyExtraHoursHours: number;
  dailyExtraHoursAmount: number;
  nightlyExtraHoursHours: number;
  nightlyExtraHoursAmount: number;
  weekendHoursHours: number;
  weekendHoursAmount: number;
  nightlyWeekendExtraHoursHours: number;
  nightlyWeekendExtraHoursAmount: number;
  holidayDays: number;
  holidaysAmount: number;
  otherIncomes: number;
  unjustifiedAbsenceDays: number;
  unjustifiedAbsenceAmount: number;
  subTotal: number;
  discountIps: number;
  discountAdvancePayment: number;
  discountLoans: number;
  discountJudicial: number;
  suspensionDays: number;
  suspensionAmount: number;
  lateArrivalHours: number;
  lateArrivalMinutes: number;
  lateArrivalAmount: number;
  otherDiscounts: number;
  familyBonus: number;
  netToDeposit: number;
  viaticum: number;
  parking: number;
  salaryBump: number;
  totalPayment: number;
  laborRegime: string;
};