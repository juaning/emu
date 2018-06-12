import * as express from 'express';
import PersonalDataController from './../controllers/PersonalDataController';

const router = express.Router();
const personalDataController = new PersonalDataController();

router.route('/')
.get(personalDataController.getAllPersonalData)
.post(personalDataController.addPersonalData);

router.route('/:personalDataId')
.get(personalDataController.getPersonalDataWithID)
.put(personalDataController.updatePersonalData)
.delete(personalDataController.deletePersonalData);

export default router;