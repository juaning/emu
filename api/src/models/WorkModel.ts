import * as mongoose from 'mongoose';

const { Schema } = mongoose;

const WorkSchema = Schema({
  // employeeId: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'PersonalData',
  //   required: true,
  //   index: true,
  // },
  employeeId: {
    type: String,
    required: true,
    index: true,
  },
  startDate: { type: Date , required: true },
  startDateContract: { type: Date },
  endDateContract: { type: Date },
  contractType: { type: String },
  jobTitle: { type: String },
  costCentre: { type: String },
  startTime: { type: String },
  endTime: { type: String },
  shift: {
    type: String,
    enum: ['morning', 'afternoon', 'night'],
  },
  monthlySalary: { type: Number },
  dailySalary: { type: Number },
  hourlySalary: { type: Number },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

const WorkModel = mongoose.model('WorkModel', WorkSchema);

export default WorkModel;