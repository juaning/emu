import * as mongoose from 'mongoose';

const { Schema } = mongoose;

const EducationSchema = Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'PersonalData',
    required: true,
    unique: true,
  },
  educationalLevel: { type: String },
  languages: [String],
  courses: [{
    courseInstitution: String,
    courseTitle: String,
    year: String,
  }],
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

const EducationModel = mongoose.model('EducationModel', EducationSchema);

export default EducationModel;