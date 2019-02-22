import * as express from 'express';
import WorkController from '../controllers/WorkController';

const router = express.Router();
const workController = new WorkController();

router.route('/')
.get(workController.getAllWorkData)
.post(workController.addWorkData);

router.route('/:workId')
.get(workController.getWorkDataWithId)
.put(workController.updateWorkData)
.delete(workController.deleteWorkData);

export default router;