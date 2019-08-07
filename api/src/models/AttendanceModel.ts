import * as mongoose from 'mongoose';

const { Schema } = mongoose;

const AttendanceSchema = Schema({
  employeeId: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  totalMonthDays: { type: Number, default: 30 },
  totalWorkedDays: { type: Number, default: 30 },
  totalWorkedSSDays: { type: Number, default: 30 },
  holidayDays: { type: Number, default: 0 },
  discountDays: { type: Boolean, default: false },
  reportDiscountDays: { type: Boolean, default: false },
  date: { type: Date },
  extraHours: {
    total: { type: Number, default: 0 },
    nightlyHours: { type: Number, default: 0 },
    dailyExtraHours: { type: Number, default: 0 },
    nightlyExtraHours: { type: Number, default: 0 },
    sundayHolidaysHours: { type: Number, default: 0 },
    sundayHolidaysExtraHours: { type: Number, default: 0 },
  },
  absence: {
    excusedAbsence: {
      days: { type: Number, default: 0 },
      discount: { type: Boolean, default: false },
      socialSecurityDiscount: { type: Boolean, default: false },
    },
    unjustifiedAbsence: {
      days: { type: Number, default: 0 },
      discount: { type: Boolean, default: false },
      socialSecurityDiscount: { type: Boolean, default: false },
    },
    suspension: {
      days: { type: Number, default: 0 },
      discount: { type: Boolean, default: false },
      socialSecurityDiscount: { type: Boolean, default: false },
    },
    permission: {
      days: { type: Number, default: 0 },
      discount: { type: Boolean, default: false },
      socialSecurityDiscount: { type: Boolean, default: false },
    },
  },
  lateArrivalHours: { type: Number, default: 0 },
  lateArrivalMinutes: { type: Number, default: 0 },
  laborRegime: { type: String, default: 'monthly' },
  totalWorkedHours: { type: Number, default: 0 },
  totalWorkedMinutes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

AttendanceSchema.virtual('month').get(function() {
  return this.date.getMonth() + 1;
});
AttendanceSchema.virtual('year').get(function() {
  return this.date.getFullYear();
})
AttendanceSchema.virtual('monthYear').set(function(monthYear) {
  const [month, year] = monthYear.split('-');
  const date = new Date(year, (month - 1));
  this.date = date;
});

export default AttendanceSchema;