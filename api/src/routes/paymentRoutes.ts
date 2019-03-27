import * as express from 'express';
import PaymentController from '../controllers/PaymentController';

const router = express.Router();
const paymentController = new PaymentController();

router.route('/')
.get(paymentController.getAllPaymentData)
.post(paymentController.addPaymentData);

router.route('/:paymentId')
.get(paymentController.getPaymentDataWithId)
.put(paymentController.updatePaymentData)
.delete(paymentController.deletePaymentData);

router.route('/employee/:employeeId')
.get(paymentController.getAllPaymentDataFromEmployee);

export default router;