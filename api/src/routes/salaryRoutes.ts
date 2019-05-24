import * as express from 'express';
import SalaryController from '../controllers/SalaryController';

const router = express.Router();
const salaryController = new SalaryController();

router.route('/')
.post(salaryController.addEmployeeSalary);

router.route('/:monthYear')
.get(salaryController.getSalaryMonthYear)
.post(salaryController.addMultipleEmployees)
.put(salaryController.updateSalaryMonthYear)
.delete(salaryController.deleteSalaryMonthYear);

router.route('/:monthYear/excel')
.get(salaryController.getSalaryMonthYearExcel);

router.route('/id/:salaryId')
.get(salaryController.getSalaryById)
.put(salaryController.updateSalaryById)
.delete(salaryController.deleteSalaryById);

export default router;