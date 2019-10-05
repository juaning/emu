import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import * as Excel from 'exceljs';
import * as fs from 'fs';
import { file } from 'tempy';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';
import * as writtenNumber from 'written-number';
import * as moment from 'moment';
import SalarySchema, { SalaryInterface } from './../models/SalaryModel';
import WorkModel from './../models/WorkModel';
import { laborRegimeConstant, jobTitleConstant } from '../resources/constants';

const Salary = mongoose.model('Salary', SalarySchema);
writtenNumber.defaults.lang = 'es';
moment.locale('es-PY');

class SalaryController {
  private async generatePDF(templatePath: string, name: string, content: object) : Promise<string> {
    const htmlTemplatePath = path.resolve(__dirname, templatePath);
    const templateHtml = fs.readFileSync(htmlTemplatePath, 'utf8');
    const template = handlebars.compile(templateHtml);
    const html = template(content);
    const options = {
      displayHeaderFooter: true,
      printBackground: true,
      preferCSSPageSize: true,
      format: 'A4',
    };
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox'],
      });
      const page = await browser.newPage();
      await page.goto(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`, {
        waitUntil: 'networkidle0',
      });
      await page.emulateMedia('print');
      const pdfBuffer = await page.pdf(options);
      await browser.close();
      return Promise.resolve(pdfBuffer);
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }

  private mapSalaries(salaryList: Array<SalaryInterface>, extras: { companyLogo: string, companyName: string }) : object {
    const { companyLogo, companyName } = extras;
    const daysPerMonthByLaborRegime = {
      monthly: 30,
      daily: 26,
      hourly: 26,
    };
    const receipts = salaryList.map(item => {
      const mDate = moment(item.date);
      const laborRegime = laborRegimeConstant.find(lr => lr.value === item.laborRegime);
      const jobTitle = jobTitleConstant.find(jt => jt.value === item.jobTitle);
      const totalDiscount = item.discountIps + item.discountAdvancePayment +
      item.discountLoans + item.discountJudicial + item.unjustifiedAbsenceAmount +
      item.suspensionAmount + item.otherDiscounts;
      const daysInMonth = daysPerMonthByLaborRegime[item.laborRegime];
      const paidSalary = item.paidSalary || ((item.wage / daysInMonth) * item.totalWorkedDays);
      return { receipt: {
        companyName,
        companyLogo,
        employee: {
          name: `${item.firstName} ${item.lastName}`,
          jobTitle: jobTitle.text,
          documentId: parseInt(item.employeeDocumentId).toLocaleString('es-PY'),
          laborRegime: laborRegime.text,
          wage: Math.round(item.wage).toLocaleString('es-PY'),
        },
        paymentDate: mDate.format('MMMM-YYYY'),
        items: [
          {
            income: {
              concept: 'Salario',
              cant: item.totalWorkedDays,
              price: Math.round(paidSalary).toLocaleString('es-PY'),
            },
            discounts: {
              concept: 'IPS (9%)',
              cant: '-',
              price: Math.round(item.discountIps).toLocaleString('es-PY'),
            },
          },
          {
            income: {
              concept: 'Hrs. Nocturnas',
              cant: item.nightHoursHours,
              price: Math.round(item.nightHoursAmount).toLocaleString('es-PY'),
            },
            discounts: {
              concept: 'Anticipo',
              cant: '-',
              price: Math.round(item.discountAdvancePayment).toLocaleString('es-PY'),
            },
          },
          {
            income: {
              concept: 'Hrs. Extra Diurnas',
              cant: item.dailyExtraHoursHours,
              price: Math.round(item.dailyExtraHoursAmount).toLocaleString('es-PY'),
            },
            discounts: {
              concept: 'Prestamos',
              cant: '-',
              price: Math.round(item.discountLoans).toLocaleString('es-PY'),
            },
          },
          {
            income: {
              concept: 'Hrs. Domingos y Feriados',
              cant: item.weekendHoursHours,
              price: Math.round(item.weekendHoursAmount).toLocaleString('es-PY'),
            },
            discounts: {
              concept: 'Judicial',
              cant: '-',
              price: Math.round(item.discountJudicial).toLocaleString('es-PY'),
            },
          },
          {
            income: {
              concept: 'Hrs. Extras Nocturnas Domingos y Feriados',
              cant: item.nightlyWeekendExtraHoursHours,
              price: Math.round(item.nightlyWeekendExtraHoursAmount).toLocaleString('es-PY'),
            },
            discounts: {
              concept: 'Ausencias',
              cant: item.unjustifiedAbsenceDays,
              price: Math.round(item.unjustifiedAbsenceAmount).toLocaleString('es-PY'),
            },
          },
          {
            income: {
              concept: 'Bonif. Familiar',
              cant: '-',
              price: Math.round(item.familyBonus).toLocaleString('es-PY'),
            },
            discounts: {
              concept: 'Suspenciones',
              cant: item.suspensionDays,
              price: Math.round(item.suspensionAmount).toLocaleString('es-PY'),
            },
          },
          {
            income: {
              concept: 'Otros Ingresos',
              cant: '-',
              price: Math.round(item.otherIncomes).toLocaleString('es-PY'),
            },
            discounts: {
              concept: 'Otros Descuentos',
              cant: '-',
              price: Math.round(item.otherDiscounts).toLocaleString('es-PY'),
            },
          }
        ],
        totalIncome: Math.round(item.subTotal).toLocaleString('es-PY'),
        totalDiscount: Math.round(totalDiscount).toLocaleString('es-PY'),
        totalPayment: Math.round(item.totalPayment).toLocaleString('es-PY'),
        totalWritten: writtenNumber(item.totalPayment),
        date: mDate.add(1, 'M').format('D/MM/YYYY'),
      }
    }});
    return { receipts };
  }

  private async getJobTitle(salaryList: Array<SalaryInterface>, month: number, year: number) : Promise<Array<SalaryInterface>> {
    const lastDayDate = new Date(Date.UTC(year, (month-1)));
    const firstDayObj = moment.utc(lastDayDate).startOf('month');
    const lastDayObj = moment.utc(lastDayDate).endOf('month').startOf('day');
    const addJobTitle = async () => await Promise.all(salaryList.map(async salary => {
      // Get work data for employee
      const workData = await WorkModel.findOne({
        $or: [
          { endDateContract: { $exists: false } },
          { endDateContract: { $gte: lastDayObj.toString() } },
          { endDateContract: { $lt: firstDayObj.toString() } },
          { endDateContract: null },
        ],
        employeeId: salary.employeeId,
      });
      salary['jobTitle'] = workData.jobTitle;
      return salary;
    }));
    const sl = await addJobTitle();
    return sl;
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
    const date = new Date(Date.UTC(parseInt(year), (parseInt(month) - 1)));

    Salary.find({ date })
      .then(salaryList => res.json(salaryList))
      .catch(err => res.send(err));
  }

  public getSalaryMonthYearExcel(req: Request, res: Response) {
    const { monthYear } = req.params;
    const [ month, year ] = monthYear.split('-');
    const date = new Date(Date.UTC(+year, (+month - 1)));

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
    const date = new Date(Date.UTC(+year, (+month - 1)));

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
    const date = new Date(Date.UTC(+year, (+month - 1)));

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
    const [ month, year ] = monthYear.split('-');
    const date = new Date(Date.UTC(parseInt(year), (parseInt(month) - 1)));

    const htmlTemplatePath = '../assets/templates/salaryReceipt.template.html';
    const base64_encode = file => {
      const bitmap = fs.readFileSync(file);
      return new Buffer(bitmap).toString('base64');
    };
    const imgPath = path.resolve(__dirname, '../assets/templates/assets/img/folklogo.png');
    const companyLogo = 'data:image/png;base64,' + base64_encode(imgPath);
    
    try {
      let salaryList = await Salary.find({ date });
      
      if (salaryList.length > 0) {
        salaryList = await this.getJobTitle(salaryList, parseInt(month), parseInt(year));
      }
      const extras = {
        companyName: 'Emprendimientos Globales SRL',
        companyLogo,
      }
      const mappedList = this.mapSalaries(salaryList, extras);
      const pedefe = await this.generatePDF(htmlTemplatePath, monthYear, mappedList);
      res.type('application/pdf');
      res.send(pedefe);
    } catch (error) {
        res.json({ error });
    }
    return;
  }

  public async getSSFile(req: Request, res: Response) {
    const { monthYear } = req.params;
    const [ month, year ] = monthYear.split('-');
    const date = new Date(Date.UTC(parseInt(year), (parseInt(month) - 1)));

    /**
     * Fields length
     * A; 4, fill with: 0
     * B: 2, fill with: 0
     * C: 4, fill with: 0
     * D: 10, fill with: ' '
     * E: 10, fill with: ' '
     * F: 30, fill with: ' '
     * G: 30, fill with: ' '
     * H: 1, fill with: ' '
     * I: 2, fill with: ' '
     * J: 10, fill with: ' '
     * K: 6, fill with: ' '
     * L: 2, fill with: ' '
     * M: 10, fill with: ' '
     */
  }
}

export default SalaryController;