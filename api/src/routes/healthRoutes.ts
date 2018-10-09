import * as express from 'express';
import HealthController from './../controllers/HealthController';

const router = express.Router();
const healthController = new HealthController();

router.route('/')
.get(healthController.getAllHealthData)
.post(healthController.addHealthData);

router.route('/:healthId')
.get(healthController.getHealthDataWithID)
.put(healthController.updateHealthData)
.delete(healthController.deleteHealthData);

export default router;