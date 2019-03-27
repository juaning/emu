import PaymentModel from '../models/PaymentModel';
import { Request, Response } from 'express';

class PaymentController {
  public getAllPaymentData(req: Request, res: Response) {
    PaymentModel.find({})
      .then(paymentList => res.json(paymentList))
      .catch(err => res.send(err));
  }

  public addPaymentData(req: Request, res: Response) {
    const newPaymentData = new PaymentModel(req.body);

    newPaymentData.save()
      .then(paymentData => res.json(paymentData))
      .catch(err => res.send(err));
  }

  public getPaymentDataWithId(req: Request, res: Response) {
    const { paymentId } = req.params;

    PaymentModel.findById(paymentId)
      .then(paymentData => res.json(paymentData))
      .catch(err => res.send(err));
  }

  public updatePaymentData(req: Request, res: Response) {
    const { paymentId } = req.params;
    PaymentModel.findOneAndUpdate({ _id: paymentId }, req.body, { new: true })
      .then(paymentUpdated => res.json(paymentUpdated))
      .catch(err => res.send(err));
  }

  public deletePaymentData(req: Request, res: Response) {
    const { paymentId } = req.params;
    PaymentModel.remove({ _id: paymentId })
      .then(() => res.json({ message: `Successfully deleted Payment data: ${paymentId}` }))
      .catch(err => res.send(err));
  }

  public getAllPaymentDataFromEmployee(req: Request, res: Response) {
    const { employeeId } = req.params;
    PaymentModel.find( { employeeId })
      .then(paymentData => res.json(paymentData))
      .catch(err => res.send(err));
  }
}

export default PaymentController;