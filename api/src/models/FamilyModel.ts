import * as mongoose from 'mongoose';
import * as validate from 'mongoose-validator';

const { Schema } = mongoose;

const FamilySchema = Schema({
  employeeId: { type: String, required: true },
  childNumber: { type: Number },
  childs: [{
    dob: { type: Date },
    apply: { type: Boolean },
    bonusStartDate: { type: Date },
  }],
  firstNamePartner: { type: String },
  lastNamePartner: { type: String },
  workplacePartner: { type: String },
});

export default FamilySchema;