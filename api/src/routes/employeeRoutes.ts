import * as express from 'express';
import PersonalDataRoutes from './personalDataRoute';
import HealthRoutes from './healthRoutes';
import FamilyRoutes from './familyRoutes';
import AttendanceRoutes from './attendanceRoutes';

const router = express.Router();

router.use('/personal-data', PersonalDataRoutes);
router.use('/health', HealthRoutes);
router.use('/family', FamilyRoutes);
router.use('/attendance', AttendanceRoutes);

export default router;
