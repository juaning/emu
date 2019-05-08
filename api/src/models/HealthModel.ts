import * as mongoose from 'mongoose';
import * as validate from 'mongoose-validator';

const { Schema } = mongoose;

const HealthSchema = Schema({
  employeeId: { type: String, required: true },
  bloodType: {
    type: String,
    enum: ['a+', 'a-', 'b+', 'b-', 'o+', 'o-', 'ab+', 'ab-'],
  },
  alergies: { type: String },
  conditions: { type: String },
  emergencyContactName: { type: String },
  emergencyContactNumber: {
    type: String,
    lowercase: true,
    trim: true,
    validate: [
      validate({
        validator: 'isNumeric',
        arguments: [6, 20],
        message: 'Not a valid phone number.',
      }),
    ],
  },
  healthInsurance: { type: String },
});

export default HealthSchema;
