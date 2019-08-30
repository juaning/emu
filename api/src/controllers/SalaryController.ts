import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import * as Excel from 'exceljs';
import * as fs from 'fs';
import { file } from 'tempy';
// import TeaSchool from 'tea-school';
// import * as pug from 'pug';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';
import { Options as SassOptions } from 'node-sass';
import SalarySchema from './../models/SalaryModel';

const Salary = mongoose.model('Salary', SalarySchema);

class SalaryController {
  private async generatePDF(templatePath: string, name: string, content: object) : Promise<string> {
    const htmlTemplatePath = path.resolve(__dirname, templatePath);
    const templateHtml = fs.readFileSync(htmlTemplatePath, 'utf8');
    const template = handlebars.compile(templateHtml);
    const html = template(content);
    const milis = (new Date()).getTime();
    const pdfPath = path.resolve(__dirname, '../assets/output', `${name}-${milis}.pdf`);
    const options = {
      width: '1230px',
      headerTemplate: "<p></p>",
      footerTemplate: "<p></p>",
      displayHeaderFooter: false,
      margin: {
        top: "10px",
        bottom: "30px"
      },
      printBackground: true,
      path: pdfPath
    };
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox'],
      });
      const page = await browser.newPage();
      await page.goto(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`, {
        waitUntil: 'networkidle0'
      });
      console.log(html);
      await page.pdf(options);
      await browser.close();
      return Promise.resolve(pdfPath);
    } catch (error) {
      return error;
    }
  }

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
    const { monthYear } = req.params;
    const htmlTemplatePath = '../assets/templates/salaryReceiptPDF.template.html';
    const data = {
      title: "A new Brazilian School",
      date: "05/12/2018",
      name: "Rodolfo Luis Marcos",
      age: 28,
      birthdate: "12/07/1990",
      course: "Computer Science",
      obs: "Graduated in 2014 by Federal University of Lavras, work with Full-Stack development and E-commerce."
    };
    try {
      const pedefe = await this.generatePDF(htmlTemplatePath, monthYear, data);
      res.sendFile(pedefe);
    } catch (error) {
        res.json({ error });
    }
    return;
  }
}

export default SalaryController;