import * as mongoose from 'mongoose';

const { Schema } = mongoose;

const PaymentSchema = Schema({
  employeeId: {
    type: String,
    required: true,
    index: true,
  },
  paymentOption: { type: String },
  bankName: { type: String },
  accountNo: { type: String },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

const PaymentModel = mongoose.model('PaymentModel', PaymentSchema);

export default PaymentModel;