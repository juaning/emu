import * as mongoose from 'mongoose';
import FamilySchema from './../models/FamilyModel';
import { Request, Response } from 'express';

const Family = mongoose.model('Family', FamilySchema);

class FamilyController {
  public getAllFamilyData(req: Request, res: Response) {
    Family.find({}, (err, family) => {
      if (err) res.send(err);
      res.json(family);
    });
  }

  public addFamilyData(req: Request, res: Response) {
    const newFamilyData = new Family(req.body);

    newFamilyData.save((err, family) => {
      if (err) res.send(err);
      res.json(family);
    });
  }

  public getFamilyDataWithId(req: Request, res: Response) {
    Family.findById(req.params.familyId, (err, family) => {
      if (err) res.send(err);
      res.json(family);
    });
  }
  
  public updateFamilyData(req: Request, res: Response) {
    Family.findOneAndUpdate({
      _id: req.params.familyId,
    },
    req.body,
    { new: true },
    (err, family) => {
      if (err) res.send(err);
      res.json(family);
    });
  }
  public deleteFamilyData(req: Request, res: Response) {
    Family.remove({
      _id: req.params.familyId,
    },
    (err) => {
      if (err) res.send(err);
      res.json({ message: `Successfully deleted Family data: ${req.params.familyId}` })
    });
  }

  getLatestFamilyDataFromEmployee(req: Request, res: Response) {
    const { employeeId } = req.params;
    Family.findOne({ employeeId, }).sort({ $natural: -1 })
      .then(familyData => res.json(familyData))
      .catch(err => res.send(err));
  }
}

export default FamilyController;