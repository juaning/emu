import * as mongoose from 'mongoose';
import * as validate from 'mongoose-validator';

const { Schema } = mongoose;

const PersonalDataSchema = Schema({
  documentId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  DOB: { type: Date, required: true },
  maritalStatus: {
    type: String,
    enum: ['single', 'married', 'divorced', 'other'],
  },
  address: { type: String },
  phone: {
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
  nationality: { type: String },
  gender: { type: String, enum: ['none', 'female', 'male'] },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    index: true,
    unique: true,
    validate: [
      validate({
        validator: 'isEmail',
        message: 'Not a valid email.',
      }),
    ],
  },
  updated: { type: Date, default: Date.now },
}, { timestamps: true });

PersonalDataSchema.methods.toWeb = () => {
  const json = this.toJSON();
  // eslint-disable-next-line no-underscore-dangle
  json.id = this._id;
  return json;
};

export default PersonalDataSchema;
