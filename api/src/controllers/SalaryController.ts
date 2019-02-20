import * as mongoose from 'mongoose';
import SalarySchema from './../models/SalaryModel';
import { Request, Response } from 'express';

const Salary = mongoose.model('Salary', SalarySchema);

class SalaryController {
  public getSalaryById(req: Request, res: Response) {
    const { salaryId } = req.params;
    Salary.findById(salaryId)
      .then(employeeSalary => res.json(employeeSalary))
      .catch(err => res.send(err));
  }

  public getSalaryMonthYear(req: Request, res: Response) {
    const { monthYear } = req.params;
    const [ month, year ] = monthYear.split('-');
    const date = new Date(Date.UTC(year, (month - 1)));

    Salary.find({ date })
      .then(salaryList => res.json(salaryList))
      .catch(err => res.send(err));
  }

  public addEmployeeSalary(req: Request, res: Response) {
    const newEmployeeSalaryData = new Salary(req.body);

    newEmployeeSalaryData.save()
      .then(emploeyeeSalary => res.json(emploeyeeSalary))
      .catch(err => res.send(err));
  }

  public addMultipleEmployees(req: Request, res: Response) {
    const { monthYear } = req.params;
    const { employees } = req.body;
    const [ month, year ] = monthYear.split('-');
    const date = new Date(Date.UTC(year, (month - 1)));

    employees.forEach(employee => employee.date = date);
    Salary.insertMany(employees)
      .then(employeesSaved => res.json(employeesSaved))
      .catch(err => res.send(err));
  }

  public updateSalaryById(req: Request, res: Response) {
    const { salaryId } = req.params;

    Salary.findOneAndUpdate({ _id: salaryId }, req.body, { new: true })
      .then(employeeSalary => res.json(employeeSalary))
      .catch(err => res.send(err));
  }

  public updateSalaryMonthYear(req: Request, res: Response) {
    const { employees } = req.body;

    const updates = employees.map(salary => Salary.findOneAndUpdate({
      '_id': salary._id,
    }, salary, { new: true }).exec());

    Promise.all(updates)
      .then(employeesUpdated => res.json(employeesUpdated))
      .catch(err => res.send(err));
  }

  public deleteSalaryById(req: Request, res: Response) {
    const { salaryId } = req.params;

    Salary.remove({ _id: salaryId })
      .then(() => res.json({ message: `Salary id: ${salaryId} has been removed`}))
      .catch(err => res.send(err));
  }

  public deleteSalaryMonthYear(req: Request, res: Response) {
    const { monthYear } = req.params;
    const [month, year] = monthYear.split('-');
    const date = new Date(Date.UTC(year, (month - 1)));

    Salary.deleteMany({ date })
      .then(result => res.json({
        message: `Salary for ${monthYear} has been deleted.`
        + ` ${result.deletedCount} documents deleted`,
        result,
      }))
      .catch(err => res.send(err));
  }
}

export default SalaryController;