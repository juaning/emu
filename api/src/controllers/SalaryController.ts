import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import * as Excel from 'exceljs';
import { file } from 'tempy';
import TeaSchool from 'tea-school';
import * as pug from 'pug';
import * as path from 'path';
import { PDFOptions } from 'puppeteer';
import { Options as SassOptions } from 'node-sass';
import SalarySchema from './../models/SalaryModel';

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

  public getSalaryMonthYearExcel(req: Request, res: Response) {
    const { monthYear } = req.params;
    const [ month, year ] = monthYear.split('-');
    const date = new Date(Date.UTC(year, (month - 1)));

    Salary.find({ date })
      .then(salaryList => {
        const reportName = `salarios-${year}${month}.xlsx`;
        const workbook = new Excel.Workbook();
        const sheet = workbook.addWorksheet(`Salarios_${year}${month}`)
        const headers = [
          { key: 'employeeId', header: 'Cod. Empleado' },
          { key: 'firstName', header: 'Nombre' },
          { key: 'lastName', header: 'Apellido' },
          { key: 'employeeDocumentId', header: 'Documento' },
          { key: 'wage', header: 'Salario' },
          { key: 'totalWorkedDays', header: 'Días Trabajados' },
          { key: 'nightHoursHours', header: 'Horas Extras Nocturnas' },
          { key: 'nightHoursAmount', header: 'Monto Horas Extras Nocturnas' },
          { key: 'dailyExtraHoursHours', header: 'Horas Extras Diurnas' },
          { key: 'dailyExtraHoursAmount', header: 'Monto Horas Extras Diurnas' },
          { key: 'nightlyExtraHoursHours', header: 'Horas Extras Nocturnas' },
          { key: 'nightlyExtraHoursAmount', header: 'Monto Horas Extras Nocturnas' },
          { key: 'weekendHoursHours', header: 'Horas Fin de Semana' },
          { key: 'weekendHoursAmount', header: 'Monto Horas Fin de Semana' },
          { key: 'nightlyWeekendExtraHoursHours', header: 'Horas Nocturnas Fin de Semana' },
          { key: 'nightlyWeekendExtraHoursAmount', header: 'Monto Horas Nocturnas Fin de Semana' },
          { key: 'holidayDays', header: 'Días de Vacaciones' },
          { key: 'holidaysAmount', header: 'Monto Días de Vacaciones' },
          { key: 'otherIncomes', header: 'Otros Ingresos' },
          { key: 'unjustifiedAbsenceDays', header: 'Días de Ausencia Injustificada' },
          { key: 'unjustifiedAbsenceAmount', header: 'Monto Días de Ausencia Injustificada' },
          { key: 'subTotal', header: 'Sub-Total' },
          { key: 'discountIps', header: 'Descuento IPS' },
          { key: 'discountAdvancePayment', header: 'Descuento Avances' },
          { key: 'discountLoans', header: 'Descuento Prestamos' },
          { key: 'discountJudicial', header: 'Descuentos Judiciales' },
          { key: 'suspensionDays', header: 'Días de Suspención' },
          { key: 'suspensionAmount', header: 'Monto Días de Suspención' },
          { key: 'lateArrivalHours', header: 'Llegadas Tardías (horas)' },
          { key: 'lateArrivalMinutes', header: 'Llegadas Tardías (minutos)' },
          { key: 'lateArrivalAmount', header: 'Llegadas Tardías (monto)' },
          { key: 'otherDiscounts', header: 'Otros Descuentos' },
          { key: 'familyBonus', header: 'Bono Familiar' },
          { key: 'netToDeposit', header: 'Neto a Depositar' },
          { key: 'viaticum', header: 'Viatico' },
          { key: 'parking', header: 'Estacionamiento' },
          { key: 'salaryBump', header: 'Aumento de Salario' },
          { key: 'totalPayment', header: 'Total a Pagar' },
        ];
        sheet.columns = headers;
        sheet.addRows(salaryList);
        const tempfilePath = file({name: reportName});
        return workbook.xlsx.writeFile(tempfilePath)
        .then(() => {
          res.attachment(reportName);
          res.sendFile(tempfilePath);
        });
      })
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

  public async getAllSalariesReceipt(req: Request, res: Response) {
    const styleOptions: SassOptions = {
      file: path.resolve(__dirname, '../assets/styles/salaryPdf.scss'),
    };
    const htmlTemplatePath = path.resolve(__dirname,
      '../assets/templates/salaryReceipt-pdf.template.pug');
    const htmlTemplateOptions: pug.LocalsObject = {
      receipt: {
        companyName: 'Emu',
        employee: {
          name: 'Juan Ignacio',
          position: 'Panadero',
          documentId: '1.435.154',
          laborRegime: 'Mensualero',
          wage: '2.000.000',
        },
        paymentDate: 'jul-2019',
        items: [
          {
            income: {
              concept: 'Salario',
              cant: '30',
              price: '2.000.000',
            },
            discounts: {
              concept: 'Anticipo',
              cant: '1',
              price: '100.000',
            }
          },
        ],
        totalIncome: '2.000.000',
        totalDiscount: '100.000',
        totalPayment: '1.900.000',
        totalWritten: 'un millon novecientos mil',
      },
    };
    const pdfOptions: PDFOptions = {
      path: path.resolve(__dirname, '../assets/output', 'receipt.pdf'),
      format: 'A4',
    };
    const teaSchoolOptions: TeaSchool.GeneratePdfOptions = {
      styleOptions,
      htmlTemplatePath,
      htmlTemplateOptions,
      pdfOptions,
    };
    console.log(TeaSchool);
    // res.json({
    //   message: 'Test path after generating pdf',
    //   obj: TeaSchool.generatePdf,
    // });
    const pdf = await TeaSchool.generatePdf(teaSchoolOptions);
    console.log(pdf.toString());
    return;
    TeaSchool.generatePdf(teaSchoolOptions)
    .then(pdf => {
      res.json({
        message: `PDF generated`,
        pdf: pdf.toString('utf8'),
      })
      // res.sendFile(path.join(__dirname, '../assets/output', 'receipt.pdf'));
    })
    .catch(err => {
      res.send(err);
      console.log(err);
    });
  }
}

export default SalaryController;