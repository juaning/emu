import * as mongoose from 'mongoose';
import HealthSchema from './../models/HealthModel';
import { Request, Response } from 'express';

const Health = mongoose.model('Health', HealthSchema);

class HealthController {
  public getAllHealthData(req: Request, res: Response) {
    Health.find({}, (err, health) => {
      if (err) res.send(err);
      res.json(health);
    });
  }

  public addHealthData(req: Request, res: Response) {
    const newHealthData = new Health(req.body);

    newHealthData.save((err, health) => {
      if (err) res.send(err);
      res.json(health);
    });
  }

  public getHealthDataWithId(req: Request, res: Response) {
    Health.findById(req.params.healthId, (err, health) => {
      if (err) res.send(err);
      res.json(health);
    });
  }

  public updateHealthData(req: Request, res: Response) {
    Health.findOneAndUpdate({
      _id: req.params.healthId,
    }, req.body, { new: true }, (err, health) => {
      if (err) res.send(err);
      res.json(health);
    });
  }

  public deleteHealthData(req: Request, res: Response) {
    Health.remove({
      _id: req.params.healthId,
    }, (err) => {
      if (err) res.send(err);
      res.json({ message: `Successfully deleted Health data: ${req.params.healthId}` });
    });
  }
}

export default HealthController;