import * as express from 'express';
import PersonalDataRoutes from './personalDataRoute';
import HealthRoutes from './healthRoutes';
import FamilyRoutes from './familyRoutes';
import EducationRoutes from './educationRoutes';
import WorkRoutes from './workRoutes';
import AttendanceRoutes from './attendanceRoutes';
import SalaryRoutes from './salaryRoutes';

const router = express.Router();

router.use('/personal-data', PersonalDataRoutes);
router.use('/health', HealthRoutes);
router.use('/family', FamilyRoutes);
router.use('/education', EducationRoutes);
router.use('/work', WorkRoutes);
router.use('/attendance', AttendanceRoutes);
router.use('/salary', SalaryRoutes);

export default router;
