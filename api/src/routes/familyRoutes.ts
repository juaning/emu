import * as express from 'express';
import FamilyController from '../controllers/FamilyController';

const router = express.Router();
const familyController = new FamilyController();

router.route('/')
.get(familyController.getAllFamilyData)
.post(familyController.addFamilyData);

router.route('/:familyId')
.get(familyController.getFamilyDataWithId)
.put(familyController.updateFamilyData)
.delete(familyController.deleteFamilyData);

export default router;