import * as express from 'express';
import EducationController from '../controllers/EducationController';

const router = express.Router();
const educationController = new EducationController();

router.route('/')
.get(educationController.getAllEducationData)
.post(educationController.addEducationData);

router.route('/:educationId')
.get(educationController.getEducationDataWithId)
.put(educationController.updateEducationData)
.delete(educationController.deleteEducationData);

router.route('/employee/:employeeId/latest')
.get(educationController.getLatestEducationDataFromEmployee);

export default router;