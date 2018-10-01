// @material-ui/icons
import DashboardIcon from '@material-ui/icons/Dashboard';
import ContentPaste from '@material-ui/icons/ContentPaste';

import Dashboard from '../../views/pro/Dashboard/Dashboard';
import RegularForms from '../../views/pro/Forms/RegularForms';
import ExtendedForms from '../../views/pro/Forms/ExtendedForms';
import ValidationForms from '../../views/pro/Forms/ValidationForms';
import Wizard from '../../views/pro/Forms/Wizard';

import Employees from '../../views/Employees/List';
import EditEmployee from '../../views/Employees/Edit';

const dashRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: DashboardIcon,
    component: Dashboard,
  },
  {
    collapse: true,
    path: '/forms',
    name: 'Forms',
    state: 'openForms',
    icon: ContentPaste,
    views: [
      {
        path: '/forms/regular-forms',
        name: 'Regular Forms',
        mini: 'RF',
        component: RegularForms,
      },
      {
        path: '/forms/extended-forms',
        name: 'Extended Forms',
        mini: 'EF',
        component: ExtendedForms,
      },
      {
        path: '/forms/validation-forms',
        name: 'Validation Forms',
        mini: 'VF',
        component: ValidationForms,
      },
      {
        path: '/forms/wizard', name: 'Wizard', mini: 'W', component: Wizard,
      },
    ],
  },
  {
    collapse: true,
    path: '/empleados',
    name: 'Empleados',
    state: 'openEmpleados',
    icon: ContentPaste,
    views: [
      {
        path: '/empleados/lista',
        name: 'Lista de Empleados',
        mini: 'LE',
        component: Employees,
      },
      {
        path: '/empleados/editar',
        name: 'Agregar Empleado',
        mini: 'AE',
        component: EditEmployee,
      },
    ],
  },
  {
    redirect: true, path: '/', pathTo: '/dashboard', name: 'Dashboard',
  },
];
export default dashRoutes;
