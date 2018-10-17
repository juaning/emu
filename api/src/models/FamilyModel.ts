import * as mongoose from 'mongoose';
import * as validate from 'mongoose-validator';

const { Schema } = mongoose;

const FamilySchema = Schema({
  employeeId: { type: String, required: true },
  childNumber: { type: Number },
  childs: { type: Map, of: Date },
  firstNamePartner: { type: String },
  lastNamePartner: { type: String },
  workplacePartner: { type: String },
});

export default FamilySchema;