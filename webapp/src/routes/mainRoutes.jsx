import Dashboard from '@material-ui/icons/Dashboard';
import DashboardPage from '../resources/views/Dashboard/Dashboard';

const mainRoutes = [
  {
    path: '/scratchpath',
    sidebarName: 'Scratchpad',
    navbarName: 'Material Dashboard',
    icon: Dashboard,
    component: DashboardPage,
  },
];

export default mainRoutes;
