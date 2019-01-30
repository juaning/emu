import * as mongoose from 'mongoose';
import PersonalDataSchema from './../models/PersonalDataModel';
import { Request, Response } from 'express';

const PersonalData = mongoose.model('PersonalData', PersonalDataSchema);

class PersonalDataController {
  public getAllPersonalData(req: Request, res: Response) {
    PersonalData.find({}, (err, personalData) => {
      if (err) res.send(err);
      res.json(personalData);
    });
  }

  public addPersonalData(req: Request, res: Response) {
    const newPersonalData = new PersonalData(req.body);
    newPersonalData.save((err, personalData) => {
      if (err) res.send(err);
      res.json(personalData);
    });
  }

  public getPersonalDataWithID(req: Request, res: Response) {
    PersonalData.findById(req.params.personalDataId, (err, personalData) => {
      if (err) res.send(err);
      res.json(personalData);
    });
  }

  public updatePersonalData(req: Request, res: Response) {
    PersonalData.findOneAndUpdate({
      _id: req.params.personalDataId,
    },
    req.body,
    { new: true },
    (err, personalData) => {
      if (err) res.send(err);
      res.json(personalData);
    });
  }

  public deletePersonalData(req: Request, res: Response) {
    PersonalData.remove({
      _id: req.params.personalDataId,
    },
    (err) => {
      if (err) res.send(err);
      res.json({ message: `Successfully deleted Personal Data ${req.params.personalDataId}` });
    });
  }
};

export default PersonalDataController;