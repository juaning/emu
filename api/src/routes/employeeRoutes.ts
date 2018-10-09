import * as express from 'express';
import PersonalDataRoutes from './personalDataRoute';
import HealthRoutes from './healthRoutes';

const router = express.Router();

router.use('/personal-data', PersonalDataRoutes);
router.use('/health', HealthRoutes);

export default router;
