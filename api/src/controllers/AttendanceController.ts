/**
 * TODO: add url check for safety (validation)
 */

import * as mongoose from 'mongoose';
import AttendanceSchema from './../models/AttendanceModel';
import { Request, Response } from 'express';

const Attendance = mongoose.model('Attendance', AttendanceSchema);

class AttendanceController {
  public getAttendanceById(req: Request, res: Response) {
    const { attendanceId } = req.params;
    Attendance.findById(attendanceId)
      .then(employeeAttendance => res.json(employeeAttendance))
      .catch(err => res.send(err));
  }

  public getAttendanceMonthYear(req: Request, res: Response) {
    const { monthYear } = req.params;
    const [ month, year ] = monthYear.split('-');
    const date = new Date(Date.UTC(parseInt(year), (parseInt(month) - 1)));

    Attendance.find({ date })
      .then(attendanceList => res.json(attendanceList))
      .catch(err => res.send(err));
  }

  public addEmployeeAttendance(req: Request, res: Response) {
    const newEmployeeAttendanceData = new Attendance(req.body);

    newEmployeeAttendanceData.save()
      .then(employeeAttendance => res.json(employeeAttendance))
      .catch(err => res.send(err));
  }

  public addMultipleEmployees(req: Request, res: Response) {
    const { monthYear } = req.params;
    const { employees} = req.body;
    const [month, year] = monthYear.split('-');
    const date = new Date(Date.UTC(parseInt(year), (parseInt(month) - 1)));
    employees.forEach(employee => {
      employee.date = date;
    });
    Attendance.insertMany(employees)
      .then(employeesSaved => res.json(employeesSaved))
      .catch(err => res.send(err));
  }

  public updateAttendanceById(req: Request, res: Response) {
    const { attendanceId } = req.params;

    Attendance.findOneAndUpdate({ _id: attendanceId }, req.body, { new: true })
     .then(employeeAttendance => res.json(employeeAttendance))
     .catch(err => res.send(err));
  }

  public updateAttendanceMonthYear(req: Request, res: Response) {
    const { monthYear } = req.params;
    const { employees} = req.body;
    const [month, year] = monthYear.split('-');
    const date = new Date(Date.UTC(parseInt(year), (parseInt(month) - 1)));
    const updates = employees.map(attendance =>
      Attendance.findOneAndUpdate({
        '_id': attendance._id
      },
      attendance,
      { new : true }).exec());
    Promise.all(updates)
      .then(employeesUpdated => res.json(employeesUpdated))
      .catch(err => res.send(err));
  }

  public deleteAttendanceById(req: Request, res: Response) {
    const { attendanceId } = req.params;

    Attendance.remove({ _id: attendanceId })
      .then(() => res.json({ message: `Attendance id: ${attendanceId} has been removed`}))
      .catch(err => res.send(err));
  }

  public deleteAttendanceMonthYear(req: Request, res: Response) {
    const { monthYear } = req.params;
    const [month, year] = monthYear.split('-');
    const date = new Date(Date.UTC(parseInt(year), (parseInt(month) - 1)));

    Attendance.deleteMany({ date })
      .then(result => res.json({
        message: `Attendance for ${month}-${year} has been deleted.`
        + ` ${result.deletedCount} documents deleted`,
        result
      }))
      .catch(err => res.send(err));
  }
}

export default AttendanceController;