import Dashboard from '@material-ui/icons/Dashboard';
import ContentPaste from '@material-ui/icons/ContentPaste';
import DashboardPage from '../views/pro/Dashboard/Dashboard';
import Employees from '../views/Employees/Employees';

const mainRoutes = [
  {
    path: '/dashboard',
    sidebarName: 'Dashboard',
    navbarName: 'Dashboard',
    icon: Dashboard,
    component: DashboardPage,
  },
  {
    path: '/empleados',
    sidebarName: 'Empleados',
    navbarName: 'Empleados',
    icon: ContentPaste,
    component: Employees,
  },
  {
    redirect: true,
    path: '/',
    to: '/dashboard',
    navbarName: 'Redirect',
  },
];

export default mainRoutes;
