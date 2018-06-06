import * as express from "express";
import { Request, Response } from "express";

const router = express.Router();

router.route('/')
.get((req: Request, res: Response) => {
  res.status(200).send({
    message: 'GET request successfull! URL /personal-data'
  });
})
.post((req: Request, res: Response) => {
  res.status(200).send({
    message: 'POST request successfull! URL /personal-data'
  });
});

router.route('/:personalDataId')
.get((req: Request, res: Response) => {
  res.status(200).send({
    message: `GET request successfull! URL /personal-data/${req.params.personalDataId}`
  });
})
.put((req: Request, res: Response) => {
  res.status(200).send({
    message: `PUT request successfull! URL /personal-data/${req.params.personalDataId}`
  });
})
.delete((req: Request, res: Response) => {
  res.status(200).send({
    message: `DELETE request successfull! URL /personal-data/${req.params.personalDataId}`
  });
});

export default router;