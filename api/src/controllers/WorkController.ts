import WorkModel from './../models/WorkModel';
import { Request, Response } from 'express';

class WorkController {
  public getAllWorkData(req: Request, res: Response) {
    WorkModel.find({})
      .then(workList => res.json(workList))
      .catch(err => res.send(err));
  }

  public addWorkData(req: Request, res: Response) {
    const newWorkData = new WorkModel(req.body);

    newWorkData.save()
      .then(workData => res.json(workData))
      .catch(err => res.send(err));
  }

  public getWorkDataWithId(req: Request, res: Response) {
    const { workId } = req.params;

    WorkModel.findById(workId)
      .then(workData => res.json(workData))
      .catch(err => res.send(err));
  }

  public updateWorkData(req: Request, res: Response) {
    const { workId } = req.params;
    WorkModel.findOneAndUpdate({ _id: workId }, req.body, { new: true })
      .then(workUpdated => res.json(workUpdated))
      .catch(err => res.send(err));
  }

  public deleteWorkData(req: Request, res: Response) {
    const { workId } = req.params;

    WorkModel.remove({ _id: workId })
      .then(() => res.json({ message: `Successfully deleted Work data: ${workId}` }))
      .catch(err => res.send(err));
  }
}

export default WorkController;