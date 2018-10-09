import * as mongoose from 'mongoose';
import * as validate from 'mongoose-validator';

const { Schema } = mongoose;

const HealthSchema = Schema({
  personal_data_id: { type: String, required: true },
  blood_type: {
    type: String,
    enum: ['a+', 'a-', 'b+', 'b-', 'o+', 'o-', 'ab+', 'ab-'],
  },
  alergies: { type: String },
  conditions: { type: String },
  emergency_contact_name: { type: String },
  emergency_contact_number: {
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
  health_insurance: { type: String },
});

export default HealthSchema;
