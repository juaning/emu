import * as express from 'express';
import HealthController from './../controllers/HealthController';

const router = express.Router();
const healthController = new HealthController();

router.route('/')
.get(healthController.getAllHealthData)
.post(healthController.addHealthData);

router.route('/:healthId')
.get(healthController.getHealthDataWithId)
.put(healthController.updateHealthData)
.delete(healthController.deleteHealthData);

router.route('/employee/:employeeId/latest')
.get(healthController.getLatestHealthDataFromEmployee);

export default router;