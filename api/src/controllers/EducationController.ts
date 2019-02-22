import EducationModel from './../models/EducationModel';
import { Request, Response } from 'express';

class EducationController {
  public getAllEducationData(req: Request, res: Response) {
    EducationModel.find({})
      .then(educationList => res.json(educationList))
      .catch(err => res.send(err));
  }

  public addEducationData(req: Request, res: Response) {
    const newEductionData = new EducationModel(req.body);

    newEductionData.save()
      .then(educationData => res.json(educationData))
      .catch(err => res.send(err));
  }

  public getEducationDataWithId(req: Request, res: Response) {
    const { educationId } = req.params;
    EducationModel.findById(educationId)
      .then(educationData => res.json(educationData))
      .catch(err => res.send(err));
  }

  public updateEducationData(req: Request, res: Response) {
    const { educationId } = req.params;
    EducationModel.findOneAndUpdate({ _id: educationId }, req.body, { new: true})
      .then(educationUpdated => res.json(educationUpdated))
      .catch(err => res.send(err));
  }

  public deleteEducationData(req: Request, res: Response) {
    const { educationId } = req.params;
    EducationModel.remove({ _id: educationId })
      .then(() => res.json({ message: `Successfully deleted Education data: ${educationId}`}))
      .catch(err => res.send(err));
  }
}

export default EducationController;