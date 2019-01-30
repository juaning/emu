import * as express from 'express';
import AttendanceController from '../controllers/AttendanceController';

const router = express.Router();
const attendanceController = new AttendanceController();

router.route('/')
.post(attendanceController.addEmployeeAttendance);

router.route('/:monthYear')
.get(attendanceController.getAttendanceMonthYear)
.post(attendanceController.addMultipleEmployees)
.put(attendanceController.updateAttendanceMonthYear)
.delete(attendanceController.deleteAttendanceMonthYear);

router.route('/id/:attendanceId')
.get(attendanceController.getAttendanceById)
.put(attendanceController.updateAttendanceById)
.delete(attendanceController.deleteAttendanceById);

export default router;